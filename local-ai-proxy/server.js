const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

const PORT = Number(process.env.PORT || 4000);
const OLLAMA_URL = (process.env.OLLAMA_URL || 'http://localhost:11434').replace(/\/$/, '');
const ANTHROPIC_URL = (process.env.ANTHROPIC_URL || 'https://api.anthropic.com').replace(/\/$/, '');
const ANTHROPIC_API_KEY = (process.env.ANTHROPIC_API_KEY || '').trim();
const ANTHROPIC_VERSION = process.env.ANTHROPIC_VERSION || '2023-06-01';

app.use(cors());

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    port: PORT,
    ollamaUrl: OLLAMA_URL,
    anthropicUrl: ANTHROPIC_URL,
    anthropicKeyConfigured: Boolean(ANTHROPIC_API_KEY),
  });
});

app.use(
  '/ollama',
  createProxyMiddleware({
    target: OLLAMA_URL,
    changeOrigin: true,
    pathRewrite: { '^/ollama': '' },
    logLevel: 'warn',
  })
);

app.use(
  '/anthropic',
  createProxyMiddleware({
    target: ANTHROPIC_URL,
    changeOrigin: true,
    pathRewrite: { '^/anthropic': '' },
    logLevel: 'warn',
    onProxyReq(proxyReq, req) {
      const incomingKey = req.headers['x-api-key'];
      if (!incomingKey && ANTHROPIC_API_KEY) {
        proxyReq.setHeader('x-api-key', ANTHROPIC_API_KEY);
      }
      if (!req.headers['anthropic-version']) {
        proxyReq.setHeader('anthropic-version', ANTHROPIC_VERSION);
      }
      if (!req.headers['content-type']) {
        proxyReq.setHeader('content-type', 'application/json');
      }
    },
  })
);

app.use(
  '/v1',
  createProxyMiddleware({
    target: ANTHROPIC_URL,
    changeOrigin: true,
    logLevel: 'warn',
    onProxyReq(proxyReq, req) {
      const incomingKey = req.headers['x-api-key'];
      if (!incomingKey && ANTHROPIC_API_KEY) {
        proxyReq.setHeader('x-api-key', ANTHROPIC_API_KEY);
      }
      if (!req.headers['anthropic-version']) {
        proxyReq.setHeader('anthropic-version', ANTHROPIC_VERSION);
      }
      if (!req.headers['content-type']) {
        proxyReq.setHeader('content-type', 'application/json');
      }
    },
  })
);

app.listen(PORT, () => {
  console.log(`Local AI proxy listening on http://localhost:${PORT}`);
  console.log(`Anthropic proxy: http://localhost:${PORT}/anthropic`);
  console.log(`Ollama proxy:    http://localhost:${PORT}/ollama`);
});
