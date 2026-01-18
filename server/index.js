const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // New: Native Node HTTP
const { Server } = require('socket.io'); // New: Socket.io
require('dotenv').config();

const Session = require('./models/Session');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Setup Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// 2. Create HTTP Server & Socket Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// 4. Socket.io Logic (The "Walkie-Talkie")
io.on('connection', (socket) => {
  console.log(`⚡ New Client Connected: ${socket.id}`);

  // Event: Student Joins a "Room" (Session)
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Event: Student sends Focus Update (e.g., "Distracted!")
  socket.on('focus-update', (data) => {
    // Broadcast this to everyone in the room (Teacher sees this)
    const { roomId, studentId, status } = data;
    io.to(roomId).emit('receive-focus-update', { studentId, status });
  });

  socket.on('disconnect', () => {
    console.log("Client disconnected");
  });
});

// 5. API Routes
app.get('/', (req, res) => res.send('🧠 Backend + Socket is Live!'));

app.post('/api/create-session', async (req, res) => {
  try {
    const { teacherId } = req.body;
    const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newSession = new Session({ code: sessionCode, teacherId: teacherId });
    await newSession.save();
    res.json({ success: true, code: sessionCode });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/join-session', async (req, res) => {
  try {
    const { code, studentId } = req.body;
    const session = await Session.findOne({ code: code.toUpperCase() });
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    if (!session.participants.includes(studentId)) {
      session.participants.push(studentId);
      await session.save();
    }
    res.json({ success: true, message: "Joined!", code: session.code });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Start Server (Note: We use 'server.listen', not 'app.listen')
server.listen(PORT, () => {
  console.log(`🚀 Real-Time Server running on port ${PORT}`);
});