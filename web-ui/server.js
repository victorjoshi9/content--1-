const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000
const OLLAMA_URL = process.env.OLLAMA_HOST || 'http://localhost:11434'

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    sendJson(res, 500, { error: error.message || 'Internal server error' })
  })
})

async function handleRequest(req, res) {
  // Handle API proxy
  if (req.url.startsWith('/api/')) {
    if (req.url.startsWith('/api/openai/models')) {
      await handleOpenAIModels(req, res)
      return
    }

    if (req.url.startsWith('/api/openai/chat')) {
      await handleOpenAIChat(req, res)
      return
    }

    proxyToOllama(req, res)
    return
  }

  // Serve static files
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url)

  const ext = path.extname(filePath)
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for SPA routing
        fs.readFile(path.join(__dirname, 'dist', 'index.html'), (err2, content2) => {
          if (err2) {
            res.writeHead(404)
            res.end('File not found')
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(content2)
          }
        })
      } else {
        res.writeHead(500)
        res.end('Server error')
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content)
    }
  })
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(payload))
}

function parseOllamaUrl(raw) {
  const parsed = raw.startsWith('http://') || raw.startsWith('https://')
    ? new URL(raw)
    : new URL(`http://${raw}`)

  return {
    hostname: parsed.hostname,
    port: parsed.port || 11434
  }
}

function normalizeBaseUrl(baseUrl) {
  const trimmed = (baseUrl || 'https://api.openai.com/v1').trim()
  return trimmed.replace(/\/$/, '')
}

const LIGHTNING_KEY_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isLightningKey(apiKey) {
  return LIGHTNING_KEY_REGEX.test((apiKey || '').trim())
}

function resolveProviderBaseUrl(apiKey, baseUrl) {
  const normalized = normalizeBaseUrl(baseUrl)
  if (isLightningKey(apiKey) && normalized.includes('api.openai.com')) {
    return 'https://lightning.ai/api/v1'
  }
  return normalized
}

function normalizeModel(model) {
  return model || 'openai/gpt-5'
}

function toProviderMessages(messages) {
  return (messages || []).map((message) => ({
    role: message.role,
    content: Array.isArray(message.content)
      ? message.content
      : [{ type: 'text', text: String(message.content || '') }]
  }))
}

function extractAssistantContent(content) {
  if (typeof content === 'string') {
    return content
  }

  if (Array.isArray(content)) {
    return content
      .filter((part) => part?.type === 'text')
      .map((part) => part.text)
      .join('\n')
  }

  return 'No response'
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })

    req.on('error', (error) => {
      reject(error)
    })
  })
}

async function handleOpenAIModels(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' })
    return
  }

  const { apiKey, baseUrl } = await readJsonBody(req)
  if (!apiKey) {
    sendJson(res, 400, { error: 'Missing apiKey' })
    return
  }

  const endpoint = `${resolveProviderBaseUrl(apiKey, baseUrl)}/models`
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })

  const text = await response.text()
  let payload = {}
  try {
    payload = text ? JSON.parse(text) : {}
  } catch {
    payload = {}
  }

  if (!response.ok) {
    const apiError = payload.error?.message || text || 'Failed to fetch models from OpenAI-compatible API'
    sendJson(res, response.status, { error: apiError })
    return
  }

  const models = (payload.data || []).map((model) => ({ name: model.id }))
  sendJson(res, 200, { models })
}

async function handleOpenAIChat(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' })
    return
  }

  const { apiKey, baseUrl, model, messages } = await readJsonBody(req)
  if (!apiKey) {
    sendJson(res, 400, { error: 'Missing apiKey' })
    return
  }

  const endpoint = `${resolveProviderBaseUrl(apiKey, baseUrl)}/chat/completions`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: normalizeModel(model),
      messages: toProviderMessages(messages),
      stream: false
    })
  })

  const text = await response.text()
  let payload = {}
  try {
    payload = text ? JSON.parse(text) : {}
  } catch {
    payload = {}
  }

  if (!response.ok) {
    const apiError = payload.error?.message || text || 'OpenAI-compatible chat request failed'
    sendJson(res, response.status, { error: apiError })
    return
  }

  const content = extractAssistantContent(payload.choices?.[0]?.message?.content)
  sendJson(res, 200, {
    message: {
      role: 'assistant',
      content
    }
  })
}

function proxyToOllama(req, res) {
  const { hostname, port } = parseOllamaUrl(OLLAMA_URL)

  const options = {
    hostname: hostname,
    port: port || 11434,
    path: req.url,
    method: req.method,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers)
    proxyRes.pipe(res)
  })

  proxyReq.on('error', (e) => {
    res.writeHead(500)
    res.end(JSON.stringify({ error: e.message }))
  })

  if (req.method !== 'GET') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      if (body) {
        proxyReq.write(body)
      }
      proxyReq.end()
    })
  } else {
    proxyReq.end()
  }
}

server.listen(PORT, () => {
  console.log(`Ollama Web UI running at http://localhost:${PORT}`)
  console.log(`Proxying Ollama API requests to ${OLLAMA_URL}`)
  console.log('OpenAI-compatible API proxy enabled at /api/openai/*')
})
