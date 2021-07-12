const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.json());
app.use(cors());

const messages = [];
// Run when client connect
io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);

  socket.emit("messages", messages);

  socket.on("message", (data) => {
    messages.push(data);
    socket.emit("messages", messages);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log("server running on port: ", PORT));
