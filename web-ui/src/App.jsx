import React, { useEffect, useRef, useState } from 'react'

const API_BASE = '/api/nim'

const DEFAULT_TASK = localStorage.getItem('nim_task') || 'qwen_code_cli'
const DEFAULT_MODEL = localStorage.getItem('nim_model') || ''
const DEFAULT_API_KEY = localStorage.getItem('nim_api_key') || ''

function App() {
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY)
  const [task, setTask] = useState(DEFAULT_TASK)
  const [models, setModels] = useState([])
  const [profiles, setProfiles] = useState({})
  const [model, setModel] = useState(DEFAULT_MODEL)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState({ connected: false, error: '' })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('nim_api_key', apiKey)
  }, [apiKey])

  useEffect(() => {
    localStorage.setItem('nim_task', task)
  }, [task])

  useEffect(() => {
    localStorage.setItem('nim_model', model)
  }, [model])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadModels() {
    if (!apiKey.trim()) {
      setStatus({ connected: false, error: 'Enter NVIDIA NIM API key' })
      setModels([])
      return
    }

    try {
      const response = await fetch(`${API_BASE}/models`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load NIM models')
      }

      setModels(data.models || [])
      setProfiles(data.profiles || {})
      setStatus({ connected: true, error: '' })

      if (!model && data.models && data.models.length > 0) {
        setModel(data.models[0].name)
      }
    } catch (error) {
      setStatus({ connected: false, error: error.message })
      setModels([])
    }
  }

  async function sendMessage() {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          task,
          model: model.trim() || undefined,
          messages: [...messages, userMessage]
        })
      })

      const data = await response.json()
      if (!response.ok) {
        const details = data.details ? `\n${data.details.join('\n')}` : ''
        throw new Error(`${data.error || 'Chat request failed'}${details}`)
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message?.content || 'No response',
          modelUsed: data.model
        }
      ])
      setStatus({ connected: true, error: '' })
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${error.message}` }
      ])
      setStatus({ connected: false, error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function clearChat() {
    setMessages([])
  }

  const quickPrompts = [
    { title: 'web', desc: 'Website coding stack' },
    { title: 'webapp', desc: 'Full web app architecture' },
    { title: 'android', desc: 'Android app development' },
    { title: 'chatbot', desc: 'Chatbot and assistant workflows' },
    { title: 'ui_design', desc: 'UI/UX design generation' },
    { title: 'animation_prompt', desc: 'Animation prompt/storyboard generation' }
  ]

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Triconnects NIM UI</h1>
        </div>

        <div className="model-selector">
          <label>NVIDIA NIM API Key</label>
          <input
            className="model-select"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="nvapi-..."
          />
        </div>

        <button className="new-chat-btn" onClick={loadModels}>
          Connect NIM
        </button>

        <div className="model-selector">
          <label>Task Profile (3-model routing)</label>
          <select className="model-select" value={task} onChange={(e) => setTask(e.target.value)}>
            {Object.keys(profiles).length > 0
              ? Object.keys(profiles).map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))
              : ['web', 'webapp', 'android', 'chatbot', 'ui_design', 'animation_prompt', 'qwen_code_cli', 'llm_studio', 'chat', 'coding', 'reasoning'].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
          </select>
        </div>

        <div className="model-selector">
          <label>Force Model (optional)</label>
          <input
            className="model-select"
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Leave empty to use task fallback chain"
          />
        </div>

        <div className="model-selector">
          <label>Available Models</label>
          <select className="model-select" value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="">Use task fallback chain</option>
            {models.map((item) => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <button className="new-chat-btn" onClick={clearChat}>
          <span>+</span> New Chat
        </button>
      </aside>

      <main className="main-content">
        <div className="chat-container">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <h2>NVIDIA NIM-Only Platform</h2>
              <p>All tasks run through NIM API. Each task profile has 3 assigned models for best performance.</p>
              <div className="quick-prompts">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.title}
                    className="quick-prompt-btn"
                    onClick={() => setTask(prompt.title)}
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
                    {msg.role === 'user' ? 'U' : 'NIM'}
                  </div>
                  <div className="message-content">
                    {msg.content}
                    {msg.modelUsed && (
                      <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
                        Model: {msg.modelUsed}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant">
                  <div className="message-avatar">NIM</div>
                  <div className="message-content">Thinking...</div>
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
              onKeyDown={handleKeyPress}
              placeholder="Ask for code, architecture, or product builds..."
              rows={1}
              style={{ minHeight: '48px' }}
            />
            <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || isLoading}>
              Send
            </button>
          </div>
        </div>

        <div className="status-bar">
          <div className="status-indicator">
            <div className={`status-dot ${status.connected ? '' : 'error'}`}></div>
            <span>{status.connected ? 'Connected to NVIDIA NIM' : status.error}</span>
          </div>
          <span>{task}</span>
        </div>
      </main>
    </div>
  )
}

export default App
