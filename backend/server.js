require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const http       = require('http');
const { Server } = require('socket.io');

const app    = express();
const server = http.createServer(app);

// ── Socket.IO (real-time: chat + emergency) ────────────────
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST'] },
});
// Attach io to app so routes can access it
app.set('io', io);
require('./socket/handlers')(io);

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/medicines',     require('./routes/medicines'));
app.use('/api/rubrics',       require('./routes/rubrics'));
app.use('/api/doctors',       require('./routes/doctors'));
app.use('/api/patients',      require('./routes/patients'));
app.use('/api/appointments',  require('./routes/appointments'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/complaints',    require('./routes/complaints'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/chat',          require('./routes/chat'));
app.use('/api/cdss',          require('./routes/cdss'));
app.use('/api/emergency',     require('./routes/emergency'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/pdf',           require('./routes/pdf'));

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HomeoAssist API running', timestamp: new Date() });
});

// ── Global error handler ───────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 HomeoAssist API  →  http://localhost:${PORT}`);
  console.log(`   WebSocket       →  ws://localhost:${PORT}`);
  console.log(`   Health check    →  http://localhost:${PORT}/api/health\n`);
});
