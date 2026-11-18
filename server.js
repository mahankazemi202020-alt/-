const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.get("/status", (req, res) => {
  res.json({
    game: "زندگی آزاد ایران",
    server: "online"
  });
});

const players = {};

io.on("connection", (socket) => {
  players[socket.id] = {
    x: 300,
    y: 200,
    city: "تهران",
    money: 1000000000
  };

  socket.emit("welcome", players[socket.id]);
  io.emit("players", players);

  socket.on("move", (data) => {
    if (!players[socket.id]) return;

    players[socket.id].x = data.x;
    players[socket.id].y = data.y;

    io.emit("players", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("players", players);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("Zendegi Azad Iran server started");
});
