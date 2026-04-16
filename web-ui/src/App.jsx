import React, { useState, useEffect, useRef } from 'react'

const API_BASE = '/api'
const LIGHTNING_PRESET = {
  provider: 'openai',
  apiKey: 'a36fe258-d828-40c7-bb2a-e380c8ed391b',
  baseUrl: 'https://lightning.ai/api/v1',
  model: 'openai/gpt-5'
}

const LIGHTNING_KEY_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isLightningKey(apiKey) {
  return LIGHTNING_KEY_REGEX.test((apiKey || '').trim())
}

function getResolvedBaseUrl(apiKey, baseUrl) {
  const trimmedUrl = (baseUrl || '').trim()

  if (isLightningKey(apiKey) && (!trimmedUrl || trimmedUrl.includes('api.openai.com'))) {
    return LIGHTNING_PRESET.baseUrl
  }

  if (!trimmedUrl) {
    return 'https://api.openai.com/v1'
  }

  return trimmedUrl
}

function App() {
  const [provider, setProvider] = useState(localStorage.getItem('provider') || LIGHTNING_PRESET.provider)
  const [openAIApiKey, setOpenAIApiKey] = useState(localStorage.getItem('openai_api_key') || LIGHTNING_PRESET.apiKey)
  const [openAIBaseUrl, setOpenAIBaseUrl] = useState(localStorage.getItem('openai_base_url') || LIGHTNING_PRESET.baseUrl)
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(localStorage.getItem('selected_model') || LIGHTNING_PRESET.model)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, error: '' })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('provider', provider)
    fetchModels(provider)
  }, [provider])

  useEffect(() => {
    localStorage.setItem('openai_api_key', openAIApiKey)
  }, [openAIApiKey])

  useEffect(() => {
    localStorage.setItem('openai_base_url', openAIBaseUrl)
  }, [openAIBaseUrl])

  useEffect(() => {
    const resolvedUrl = getResolvedBaseUrl(openAIApiKey, openAIBaseUrl)
    if (resolvedUrl !== openAIBaseUrl) {
      setOpenAIBaseUrl(resolvedUrl)
    }
  }, [openAIApiKey, openAIBaseUrl])

  useEffect(() => {
    localStorage.setItem('selected_model', selectedModel)
  }, [selectedModel])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchOllamaModels = async () => {
    try {
      const response = await fetch(`${API_BASE}/tags`)
      if (response.ok) {
        const data = await response.json()
        setModels(data.models || [])
        if (data.models?.length > 0) {
          const tinyModel = data.models.find((model) => model.name === 'tinyllama:latest')
          setSelectedModel(tinyModel ? tinyModel.name : data.models[0].name)
        }
        setConnectionStatus({ connected: true, error: '' })
      } else {
        let errorMessage = 'Failed to fetch models'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // Keep default error when response body is not JSON.
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      setConnectionStatus({ connected: false, error: `Ollama error: ${error.message}` })
    }
  }

  const fetchOpenAIModels = async () => {
    if (!openAIApiKey.trim()) {
      setModels([])
      setSelectedModel(LIGHTNING_PRESET.model)
      setConnectionStatus({ connected: false, error: 'Enter OpenAI API key to load models' })
      return
    }

    const resolvedBaseUrl = getResolvedBaseUrl(openAIApiKey, openAIBaseUrl)

    try {
      const response = await fetch(`${API_BASE}/openai/models`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: openAIApiKey,
          baseUrl: resolvedBaseUrl
        })
      })

      if (!response.ok) {
        let errorMessage = 'Failed to fetch OpenAI models'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // Keep default error when response body is not JSON.
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setModels(data.models || [])

      if (data.models?.length > 0) {
        setSelectedModel((previousModel) => {
          const exists = data.models.some((model) => model.name === previousModel)
          return exists ? previousModel : data.models[0].name
        })
      } else if (!selectedModel) {
        setSelectedModel(LIGHTNING_PRESET.model)
      }

      setConnectionStatus({ connected: true, error: '' })
    } catch (error) {
      setModels([])
      // Keep app usable when provider does not expose /models endpoint.
      setSelectedModel((previousModel) => previousModel || LIGHTNING_PRESET.model)
      setConnectionStatus({ connected: true, error: `Model list unavailable (${error.message}). You can still chat using custom model.` })
    }
  }

  const fetchModels = async (activeProvider) => {
    if (activeProvider === 'openai') {
      await fetchOpenAIModels()
      return
    }
    await fetchOllamaModels()
  }

  const sendMessage = async () => {
    if (!input.trim() || !selectedModel || isLoading) return

    const userMessage = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let response

      if (provider === 'openai') {
        if (!openAIApiKey.trim()) {
          throw new Error('OpenAI API key is required')
        }

        response = await fetch(`${API_BASE}/openai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: openAIApiKey,
            baseUrl: getResolvedBaseUrl(openAIApiKey, openAIBaseUrl),
            model: selectedModel,
            messages: [...messages, userMessage]
          })
        })
      } else {
        response = await fetch(`${API_BASE}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: selectedModel,
            messages: [...messages, userMessage],
            stream: false
          })
        })
      }

      if (!response.ok) {
        let errorMessage = 'Failed to get response'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // Keep default error when response body is not JSON.
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      const assistantMessage = { role: 'assistant', content: data.message?.content || 'No response' }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage = { role: 'assistant', content: `Error: ${error.message}` }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const quickPrompts = [
    { title: 'Create React App', desc: 'Build a React component' },
    { title: 'Python API', desc: 'Create a FastAPI endpoint' },
    { title: 'Mobile App', desc: 'React Native screen' },
    { title: 'Database Schema', desc: 'Design a PostgreSQL schema' }
  ]

  const handleQuickPrompt = (prompt) => {
    setInput(prompt)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Multi-LLM Web UI</h1>
        </div>

        <div className="model-selector">
          <label>Provider</label>
          <select
            className="model-select"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="ollama">Ollama (Local)</option>
            <option value="openai">OpenAI-Compatible API</option>
          </select>
        </div>

        {provider === 'openai' && (
          <>
            <div className="model-selector">
              <label>API Key</label>
              <input
                className="model-select"
                type="password"
                value={openAIApiKey}
                onChange={(e) => setOpenAIApiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>

            <div className="model-selector">
              <label>Base URL</label>
              <input
                className="model-select"
                type="text"
                value={openAIBaseUrl}
                onChange={(e) => setOpenAIBaseUrl(e.target.value)}
                placeholder="https://api.openai.com/v1"
              />
            </div>

            <div className="model-selector">
              <label>Model</label>
              <input
                className="model-select"
                type="text"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                placeholder="gpt-5 or openai/gpt-5"
              />
            </div>

            <button className="new-chat-btn" onClick={() => fetchModels('openai')}>
              Refresh OpenAI Models
            </button>
          </>
        )}

        <div className="model-selector">
          <label>Model</label>
          <select
            className="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={provider === 'openai'}
          >
            {models.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <button className="new-chat-btn" onClick={clearChat}>
          <span>+</span> New Chat
        </button>

        <div className="chat-history">
          {messages.length === 0 && (
            <div style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              No chat history
            </div>
          )}
        </div>
      </aside>

      <main className="main-content">
        <div className="chat-container">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <h2>Build Apps with AI</h2>
              <p>Choose a model and start creating. Your local AI assistant for web, mobile, and more.</p>
              <div className="quick-prompts">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    className="quick-prompt-btn"
                    onClick={() => handleQuickPrompt(prompt.title)}
                  >
                    <h3>{prompt.title}</h3>
                    <p>{prompt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="message-content">
                    {msg.content.split('```').map((part, i) => {
                      if (i % 2 === 1) {
                        const [lang, ...code] = part.split('\n')
                        return (
                          <pre key={i}>
                            <code>{code.join('\n')}</code>
                          </pre>
                        )
                      }
                      return <span key={i}>{part}</span>
                    })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <div className="loading-indicator">
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              className="message-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you want to build..."
              rows={1}
              style={{ minHeight: '48px' }}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || !selectedModel || isLoading}
            >
              Send
            </button>
          </div>
        </div>

        <div className="status-bar">
          <div className="status-indicator">
            <div className={`status-dot ${connectionStatus.connected ? '' : 'error'}`}></div>
            <span>
              {connectionStatus.connected
                ? `Connected to ${provider === 'openai' ? 'OpenAI-Compatible API' : 'Ollama'} (${models.length} models)`
                : connectionStatus.error}
            </span>
          </div>
          <span>{selectedModel || 'No model selected'}</span>
        </div>
      </main>
    </div>
  )
}

export default App
