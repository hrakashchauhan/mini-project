const registerFocusSockets = (io, socket) => {
  socket.on("focus:update", (data) => {
    const { roomId, studentId, status } = data || {};
    if (!roomId || !studentId || !status) return;
    io.to(roomId).emit("focus:receive", { studentId, status });
  });
};

module.exports = { registerFocusSockets };
