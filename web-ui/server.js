const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const NIM_BASE_URL = (process.env.NIM_API_HOST || 'https://integrate.api.nvidia.com/v1').replace(/\/$/, '');
const MODEL_PACK_PATH = process.env.MODEL_PACK_PATH || path.join(__dirname, '..', 'trconnects', 'model-hub', 'public-model-catalog.json');

const MODEL_POOL = [
  'qwen/qwen2.5-coder-32b-instruct',
  'qwen/qwen2.5-72b-instruct',
  'meta/llama-3.1-8b-instruct',
  'meta/llama-3.1-70b-instruct',
  'meta/llama-3.1-405b-instruct',
  'nvidia/llama-3.1-nemotron-70b-instruct',
  'mistralai/mixtral-8x7b-instruct-v0.1',
  'mistralai/mistral-large-2-instruct',
  'google/gemma-2-27b-it',
  'deepseek/deepseek-r1-distill-llama-70b'
];

const TASK_MODEL_PROFILES = {
  web: [
    'qwen/qwen2.5-coder-32b-instruct',
    'meta/llama-3.1-70b-instruct',
    'mistralai/mixtral-8x7b-instruct-v0.1'
  ],
  webapp: [
    'qwen/qwen2.5-72b-instruct',
    'meta/llama-3.1-405b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct'
  ],
  android: [
    'qwen/qwen2.5-coder-32b-instruct',
    'deepseek/deepseek-r1-distill-llama-70b',
    'meta/llama-3.1-70b-instruct'
  ],
  chatbot: [
    'meta/llama-3.1-70b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'mistralai/mistral-large-2-instruct'
  ],
  ui_design: [
    'qwen/qwen2.5-72b-instruct',
    'mistralai/mistral-large-2-instruct',
    'google/gemma-2-27b-it'
  ],
  animation_prompt: [
    'meta/llama-3.1-405b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'qwen/qwen2.5-72b-instruct'
  ],
  qwen_code_cli: [
    'qwen/qwen2.5-coder-32b-instruct',
    'meta/llama-3.1-70b-instruct',
    'mistralai/mixtral-8x7b-instruct-v0.1'
  ],
  claude_cli_style: [
    'meta/llama-3.1-405b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'qwen/qwen2.5-coder-32b-instruct'
  ],
  ollama_launch_claude: [
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'meta/llama-3.1-70b-instruct',
    'qwen/qwen2.5-coder-32b-instruct'
  ],
  llm_studio: [
    'meta/llama-3.1-70b-instruct',
    'mistralai/mixtral-8x7b-instruct-v0.1',
    'qwen/qwen2.5-coder-32b-instruct'
  ],
  chat: [
    'meta/llama-3.1-8b-instruct',
    'meta/llama-3.1-70b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct'
  ],
  coding: [
    'qwen/qwen2.5-coder-32b-instruct',
    'meta/llama-3.1-70b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct'
  ],
  reasoning: [
    'meta/llama-3.1-405b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'meta/llama-3.1-70b-instruct'
  ]
};

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
};

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    sendJson(res, 500, { error: error.message || 'Internal server error' });
  });
});

async function handleRequest(req, res) {
  if (req.url.startsWith('/api/nim/models')) {
    await handleNIMModels(req, res);
    return;
  }

  if (req.url.startsWith('/api/nim/chat')) {
    await handleNIMChat(req, res);
    return;
  }

  if (req.url.startsWith('/api/nim/profiles')) {
    sendJson(res, 200, { profiles: TASK_MODEL_PROFILES });
    return;
  }

  if (req.url.startsWith('/api/nim/model-pack')) {
    sendJson(res, 200, readModelPack());
    return;
  }

  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'dist', 'index.html'), (err2, content2) => {
          if (err2) {
            res.writeHead(404);
            res.end('File not found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content2);
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
}

function readModelPack() {
  try {
    if (!fs.existsSync(MODEL_PACK_PATH)) {
      return {
        version: 'fallback',
        models: MODEL_POOL.map((name) => ({ name })),
        taskRouting: TASK_MODEL_PROFILES,
        warning: `Model pack file not found at ${MODEL_PACK_PATH}`
      };
    }

    const content = fs.readFileSync(MODEL_PACK_PATH, 'utf8');
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    return {
      version: 'fallback',
      models: MODEL_POOL.map((name) => ({ name })),
      taskRouting: TASK_MODEL_PROFILES,
      warning: `Failed to parse model pack: ${error.message}`
    };
  }
}

function resolveApiKey(incoming) {
  return (incoming || process.env.NIM_API_KEY || process.env.NVIDIA_NIM_API_KEY || '').trim();
}

function extractContent(choiceContent) {
  if (typeof choiceContent === 'string') {
    return choiceContent;
  }

  if (Array.isArray(choiceContent)) {
    return choiceContent
      .filter((part) => part && typeof part.text === 'string')
      .map((part) => part.text)
      .join('\n');
  }

  return 'No response';
}

async function nimRequest(apiKey, endpoint, payload, method = 'POST') {
  const response = await fetch(`${NIM_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: method === 'GET' ? undefined : JSON.stringify(payload)
  });

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  return { response, data, text };
}

async function handleNIMModels(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const body = await readJsonBody(req);
  const apiKey = resolveApiKey(body.apiKey);

  if (!apiKey) {
    sendJson(res, 400, { error: 'Missing NIM API key' });
    return;
  }

  const { response, data, text } = await nimRequest(apiKey, '/models', {}, 'GET');

  if (!response.ok) {
    const apiError = data.error?.message || text || 'Failed to fetch models from NVIDIA NIM';
    sendJson(res, response.status, { error: apiError });
    return;
  }

  const models = (data.data || []).map((model) => ({ name: model.id }));
  const profileModels = Array.from(new Set([...MODEL_POOL, ...Object.values(TASK_MODEL_PROFILES).flat()])).map((name) => ({ name }));
  sendJson(res, 200, { models: models.length > 0 ? models : profileModels, profiles: TASK_MODEL_PROFILES });
}

async function handleNIMChat(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const body = await readJsonBody(req);
  const apiKey = resolveApiKey(body.apiKey);

  if (!apiKey) {
    sendJson(res, 400, { error: 'Missing NIM API key' });
    return;
  }

  const task = body.task || 'qwen_code_cli';
  const forcedModel = (body.model || '').trim();
  const models = forcedModel ? [forcedModel] : (TASK_MODEL_PROFILES[task] || TASK_MODEL_PROFILES.qwen_code_cli);

  const messages = (body.messages || []).map((message) => ({
    role: message.role,
    content: Array.isArray(message.content)
      ? message.content
          .filter((part) => part && typeof part.text === 'string')
          .map((part) => part.text)
          .join('\n')
      : String(message.content || '')
  }));

  const errors = [];
  for (const model of models) {
    const { response, data, text } = await nimRequest(apiKey, '/chat/completions', {
      model,
      messages,
      stream: false,
      temperature: 0.2
    });

    if (response.ok) {
      sendJson(res, 200, {
        model,
        task,
        message: {
          role: 'assistant',
          content: extractContent(data.choices?.[0]?.message?.content)
        }
      });
      return;
    }

    errors.push(`${model}: ${data.error?.message || text || 'request failed'}`);
  }

  sendJson(res, 502, {
    error: `All routed models failed for task ${task}`,
    details: errors
  });
}

server.listen(PORT, () => {
  console.log(`NIM Web UI running at http://localhost:${PORT}`);
  console.log(`NIM API endpoint: ${NIM_BASE_URL}`);
  console.log('NIM-only API routes enabled at /api/nim/*');
});
