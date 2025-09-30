// backend/server.js
const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const MAX_MESSAGES = 500;

// Always store here: <repo>/backend/data/messages.json
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'messages.json');

app.use(cors({ origin: true }));             // allow all origins in dev
app.use(express.json({ limit: '1mb' }));

const clients = new Set(); // SSE connections

async function ensureStorage() {
  try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch {}
  try { await fs.access(DATA_FILE); }
  catch { await fs.writeFile(DATA_FILE, '[]', 'utf8'); }
}

async function loadMessages() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (err) {
    console.error('[messages] read error:', err);
    return [];
  }
}

async function saveMessages(list) {
  const trimmed = list.slice(-MAX_MESSAGES);
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch (err) {
    console.error('[messages] write error:', err);
  }
  return trimmed;
}

function broadcast(eventName, data) {
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try { res.write(payload); } catch {}
  }
}

// History
app.get('/api/messages', async (_req, res) => {
  const list = await loadMessages();
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Cache-Control', 'no-store');
  res.json(list);
});

// Create
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
  await saveMessages(list);

  res.set('Access-Control-Allow-Origin', '*');
  res.status(201).json(message);
  broadcast('message', message);
});

// SSE stream
app.get('/api/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no',
  });

  res.write('event: hello\ndata: "connected"\n\n');

  const heartbeat = setInterval(() => {
    res.write(': ping\n\n'); // keep-alive
  }, 15000);

  clients.add(res);
  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(res);
  });
});

// Health
app.get('/health', (_req, res) => res.send('ok'));

ensureStorage().then(() => {
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
    console.log('Messages file:', DATA_FILE);
  });
});
