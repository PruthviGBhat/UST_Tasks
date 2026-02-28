// app.js - Single-file Express app with a tiny UI
const express = require('express');
const app = express();

// Middleware to read form fields
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory storage (clears when the container restarts)
let users = [];
let nextId = 1;

// HTML Template (small, self-contained)
function pageHtml(body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>User App - Simple</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 2rem; background: #f8fafc; color:#0f172a; }
    h1 { margin-bottom: 0.25rem; }
    .sub { color:#475569; margin-top:0; }
    form, .card { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:1rem; margin:1rem 0; box-shadow: 0 1px 2px rgba(0,0,0,.03); }
    label { display:block; margin:.5rem 0 .25rem; }
    input { width:100%; padding:.5rem .6rem; border:1px solid #cbd5e1; border-radius:8px; }
    button { background:#2563eb; color:white; border:0; padding:.55rem .9rem; border-radius:8px; cursor:pointer; }
    button.danger { background:#ef4444; }
    ul { list-style:none; padding:0; }
    li { display:flex; align-items:center; justify-content:space-between; padding:.6rem .25rem; border-bottom:1px dashed #e2e8f0; }
    .muted { color:#64748b; font-size:.9rem; }
    code, pre { background:#0b1020; color:#e2e8f0; border-radius:8px; padding:.35rem .5rem; }
    .row { display:flex; gap:.5rem; }
  </style>
</head>
<body>
  <h1>👤 User App</h1>
  <p class="sub">Add users, list users, and delete—super simple.</p>

  <div class="card">
    <h2>Add a user</h2>
    <form method="POST" action="/users">
      <label for="name">Name</label>
      <input id="name" name="name" placeholder="Ada Lovelace" required />
      <label for="email">Email</label>
      <input id="email" name="email" type="email" placeholder="ada@example.com" required />
      <div style="margin-top:.75rem">
        <button type="submit">➕ Add user</button>
      </div>
    </form>
    <p class="muted">Data is in-memory. Restart = empty list.</p>
  </div>

  <div class="card">
    <h2>Users</h2>
    ${body}
  </div>

  <div class="card">
    <h2>Health & Info</h2>
    <p>Health: <code><a href="/healthz">/healthz</a></code></p>
    <p>Port: <code>${process.env.PORT || 3000}</code></p>
  </div>
</body>
</html>`;
}

// Home page: list users + form is above
app.get('/', (req, res) => {
  const list = users.length === 0
    ? `<p class="muted">No users yet. Add one above.</p>`
    : `<ul>` + users.map(u => `
        <li>
          <div>
            <strong>${escapeHtml(u.name)}</strong>
            <div class="muted">${escapeHtml(u.email)}</div>
          </div>
          <form method="POST" action="/users/${u.id}/delete">
            <button class="danger" type="submit">🗑 Delete</button>
          </form>
        </li>
      `).join('') + `</ul>`;
  res.send(pageHtml(list));
});

// Create user
app.post('/users', (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }
  users.push({ id: nextId++, name: String(name), email: String(email) });
  res.redirect('/');
});

// Delete user
app.post('/users/:id/delete', (req, res) => {
  const id = Number(req.params.id);
  users = users.filter(u => u.id !== id);
  res.redirect('/');
});

// Health endpoint
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// Very tiny escape to avoid HTML injection in names/emails
function escapeHtml(s) {
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#39;");
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User app listening on http://0.0.0.0:${PORT}`);
});