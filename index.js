const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const formatMassage = require("./utils/formatMass");
const {
  userJoin,
  getCarentUser,
  leaveUser,
  joinRoom,
} = require("./utils/users");

const bot = "Chat bot";

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    const users = joinRoom(user.room);

    socket.emit("roomUsers", users);

    socket.emit("message", formatMassage(bot, " welcome to group"));
    socket.broadcast
      .to(user.room)
      .emit("message", formatMassage(bot, `${user.username} joined the group`));
  });

  socket.on("chat-message", (msg) => {
    const user = getCarentUser(socket.id);
    io.to(user.room).emit("message", formatMassage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = leaveUser(socket.id);

    io.to(user.room).emit(
      "message",
      formatMassage(bot, `${user.username} left the chat`)
    );
  });
});

const port = normalizePort(process.env.PORT || "4000");
app.set("port", port);

server.listen(port, () => {
  console.log("server working on port", port);
});

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}
