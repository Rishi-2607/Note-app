const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const noteRoutes = require("./routes/noteRoutes");
app.use("/api/notes", noteRoutes);

const authRoutes = require("./routes/auth"); 
app.use("/api/auth", authRoutes);    

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));


const activeEditors = {};
io.on("connection", (socket) => {
  socket.on("join_note", (noteId) => {
    socket.join(noteId);
    if (!activeEditors[noteId]) activeEditors[noteId] = new Set();
    activeEditors[noteId].add(socket.id);

    io.to(noteId).emit("active_users", activeEditors[noteId].size);

    socket.on("note_update", ({ noteId, content }) => {
      socket.to(noteId).emit("note_update", content);
    });

    socket.on("disconnect", () => {
      for (let room in activeEditors) {
        activeEditors[room].delete(socket.id);
        io.to(room).emit("active_users", activeEditors[room].size);
      }
    });
  });
});

server.listen(5000, () => console.log("Server listening on port 5000"));