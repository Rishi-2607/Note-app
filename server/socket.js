const activeUsers = {};

function setupSocket(io) {
  io.on("connection", (socket) => {
    socket.on("user_connected", ({ id, name }) => {
      activeUsers[socket.id] = { id, name, online: true };

      io.emit("active_user_panel", Object.values(activeUsers));
    });

    socket.on("disconnect", () => {
      if (activeUsers[socket.id]) {
        activeUsers[socket.id].online = false;
      }
      io.emit("active_user_panel", Object.values(activeUsers));
    });

    socket.on("join_note", (noteId) => {
      socket.join(noteId);
      io.to(noteId).emit("active_users", Object.values(activeUsers).length); // Example
    });

    socket.on("note_update", ({ noteId, content }) => {
      socket.to(noteId).emit("note_update", content);
    });
  });
}

module.exports = setupSocket;