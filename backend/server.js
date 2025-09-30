const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const MAX_MESSAGES = 500;
const DATA_FILE = path.join(__dirname, 'messages.json');

app.use(cors());               // allow your frontend (http://localhost:5000) by default
app.use(express.json({ limit: '1mb' }));

// Simple in-memory subscriber list for SSE
const clients = new Set();

// Helpers
async function loadMessages() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function saveMessages(list) {
  // Trim and write atomically
  const trimmed = list.slice(-MAX_MESSAGES);
  await fs.writeFile(DATA_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  return trimmed;
}

function broadcast(eventName, data) {
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try { res.write(payload); } catch { /* ignore */ }
  }
}

// Routes
app.get('/api/messages', async (req, res) => {
  const list = await loadMessages();
  res.json(list);
});

app.post('/api/messages', async (req, res) => {
  const { userId, name, text } = req.body || {};
  if (!userId || !name || !text || !String(text).trim()) {
    return res.status(400).json({ error: 'userId, name, text required' });
  }
  const message = {
    id: randomUUID(),
    userId: String(userId),
    name: String(name),
    text: String(text).slice(0, 2000),
    timestamp: Date.now(),
  };
  const list = await loadMessages();
  list.push(message);
  const saved = await saveMessages(list);

  broadcast('message', message);
  res.status(201).json(message);
});

// SSE stream for realtime
app.get('/api/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Immediately send a comment to keep connection alive
  res.write(`: connected\n\n`);

  clients.add(res);
  req.on('close', () => clients.delete(res));
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
