// 1) Importing required files
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app); // Visit https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen to understand why we did it like this
const io = require("socket.io")(server);

app.use(express.static("public")); // Middleware to server static files outside of server

// 2) Defining Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

/*
 ** connectedPeers array will contain all
 ** the users connected to the server at an instance
 */
let connectedPeers = [];

// 3) Defining events for socket connection
io.on("connection", (socket) => {
  connectedPeers.push(socket.id);
  console.log(connectedPeers);
  // Event Listner for "pre-offer" event || check wss.js in case of doubt
  socket.on("pre-offer", (data) => {
    const { callType, calleePersonalCode } = data;

    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === calleePersonalCode // Checking if callee is online
    );
    if (connectedPeer) {
      const data = {
        callType,
        callerSocketId: socket.id,
      };
      // Sending call request to clinet 2
      io.to(calleePersonalCode).emit("pre-offer", data); // Forwarding connection request to the callee with caller id and type of call
    } else {
      const data = {
        preOfferAnswer: "CALLEE_NOT_FOUND",
      };
      io.to(socket.id).emit("pre-offer-answer", data);
    }
  });

  socket.on("pre-offer-answer", (data) => {
    console.log("pre offer answer came");
    console.log(data);

    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === data.callerSocketId
    );
    console.log(connectedPeer);
    if (connectedPeer) {
      io.to(data.callerSocketId).emit("pre-offer-answer", data);
    }
  });

  // WebRTC connection request, data contains sdp information
  socket.on("webRTC-signaling", (data) => {
    const { connectedUserSocketId } = data;
    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === callerSocketId
    );

    if (connectedPeer) {
      io.to(connectedUserSocketId).emit("webRTC-signaling", data);
    }
  });

  // In case someone disconnected
  socket.on("disconnect", () => {
    console.log("User Disconnected");
    const newConnectedPeers = connectedPeers.filter(
      (peerSocketId) => peerSocketId !== socket.id
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
