const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const Session = require("./models/Session");
const { registerClassroomSockets } = require("./sockets/classroom");
const { registerFocusSockets } = require("./sockets/focus");

const app = express();
const PORT = process.env.PORT || 5000;

const parseOrigins = (value) =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = process.env.CLIENT_ORIGINS
  ? parseOrigins(process.env.CLIENT_ORIGINS)
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB error:", err));

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  registerClassroomSockets(io, socket);
  registerFocusSockets(io, socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.get("/", (req, res) => res.send("FocusAI backend is live."));

app.post("/api/create-session", async (req, res) => {
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

app.post("/api/join-session", async (req, res) => {
  try {
    const { code, studentId } = req.body;
    const session = await Session.findOne({ code: code.toUpperCase() });
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    if (!session.participants.includes(studentId)) {
      session.participants.push(studentId);
      await session.save();
    }
    res.json({ success: true, message: "Joined!", code: session.code });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Real-time server running on port ${PORT}`);
});
