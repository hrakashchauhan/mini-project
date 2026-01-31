const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);

// Allow connections from your Vite Client
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"] }));

const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

// Mapping to track users
const socketToRoom = {};
const users = {};

io.on('connection', (socket) => {
  console.log('🔌 Connection:', socket.id);

  // 1. User Joins Room
  socket.on('join-room', ({ roomId, username, role }) => {
    users[socket.id] = { username, role, roomId };
    socketToRoom[socket.id] = roomId;
    socket.join(roomId);

    // Get list of OTHER users in the room
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    const otherUsers = clients.filter(id => id !== socket.id);

    // Send list of existing users to the new person (so they can initiate calls)
    socket.emit('all-users', otherUsers);
    console.log(`✅ ${username} joined ${roomId}`);
  });

  // 2. Signaling: Sending Offer (Initiator)
  socket.on('sending-signal', (payload) => {
    io.to(payload.userToCall).emit('user-joined', { 
      signal: payload.signal, 
      callerId: payload.callerID,
      userInfo: users[payload.callerID] // Send name/role for UI
    });
  });

  // 3. Signaling: Returning Answer (Receiver)
  socket.on('returning-signal', (payload) => {
    io.to(payload.callerID).emit('receiving-returned-signal', { 
      signal: payload.signal, 
      id: socket.id 
    });
  });

  // 4. Disconnect
  socket.on('disconnect', () => {
    const roomId = socketToRoom[socket.id];
    if (roomId) {
      socket.to(roomId).emit('user-left', socket.id);
    }
    delete users[socket.id];
    delete socketToRoom[socket.id];
    console.log('❌ Disconnect:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready on port ${PORT}`);
});