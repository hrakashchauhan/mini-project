const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);

// 1. Configured CORS for security
app.use(cors({
  origin: "http://localhost:5173", // Your Client URL
  methods: ["GET", "POST"]
}));

// 2. Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// 3. The "State"
const rooms = {}; 
const socketToRoom = {}; 

io.on('connection', (socket) => {
  console.log('🔌 New Client:', socket.id);

  socket.on('join-room', ({ roomId, username, role }) => {
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(socket.id);
    socketToRoom[socket.id] = roomId;
    socket.join(roomId);

    const otherUsers = rooms[roomId].filter(id => id !== socket.id);
    socket.emit('all-users', otherUsers);

    socket.to(roomId).emit('user-joined', { 
      callerId: socket.id, 
      username, 
      role 
    });
    console.log(`User ${username} joined room ${roomId}`);
  });

  socket.on('offer', (payload) => {
    io.to(payload.userToCall).emit('offer', {
      offer: payload.offer,
      callerId: socket.id,
      username: payload.username
    });
  });

  socket.on('answer', (payload) => {
    io.to(payload.callerId).emit('answer', {
      answer: payload.answer,
      responderId: socket.id
    });
  });

  socket.on('ice-candidate', (payload) => {
    io.to(payload.target).emit('ice-candidate', {
      candidate: payload.candidate,
      senderId: socket.id
    });
  });

  socket.on('disconnect', () => {
    const roomId = socketToRoom[socket.id];
    if (roomId && rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
      socket.to(roomId).emit('user-left', socket.id);
    }
    console.log('❌ Client Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Signaling Server running on port ${PORT}`);
});