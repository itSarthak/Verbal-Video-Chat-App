// 1) Importing required files
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static("public")); // Middleware to server static files outside of server

// 2) Defining Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let connectedPeers = [];

io.on("connection", (socket) => {
  connectedPeers.push(socket.id);
  console.log(connectedPeers);
  socket.on("disconnect", () => {
    console.log("User Disconnected");
    const newConnectedPeers = connectedPeers.filter(
      (peerSocketId) => peerSocketId != socket.id
    );
    connectedPeers = newConnectedPeers;
    console.log(connectedPeers);
  });
});

// 3) Listening on our server
const PORT = process.env.PORT || 3040;

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
