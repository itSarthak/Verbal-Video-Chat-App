import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as constants from "./constants.js";

let socketIO = null; // Init socketIo value, it will change once the connection is made

// Function to register/listen Socket events
export const registerSocketEvents = (socket) => {
  socketIO = socket;
  socket.on("connect", () => {
    console.log("Successfully connected to socket.io server");
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
  });

  socket.on("pre-offer", (data) => {
    // When callee recieves a pre-offer(call) request from a caller
    webRTCHandler.handlePreOffer(data);
  });

  socket.on("pre-offer-answer", (data) => {
    // When caller recieves the answer of his pre-offer
    webRTCHandler.handlePreOfferAnswer(data);
  });

  // Adding hanging up possiblity
  socket.on("user-hanged-up", () => {
    // Bug
    webRTCHandler.handleConnectedUserHangedUp();
  });

  // Recienving WebRTC signalling event to create a P2P connection b/w caller and callee
  socket.on("webRTC-signaling", (data) => {
    switch (data.type) {
      case constants.webRTCSignaling.OFFER:
        webRTCHandler.handleWebRTCOffer(data);
        break;
      case constants.webRTCSignaling.ANSWER:
        webRTCHandler.handleWebRTCAnswer(data);
        break;
      case constants.webRTCSignaling.ICE_CANDIDATE:
        webRTCHandler.handleWRCCandidate(data);
      default:
        return;
    }
  });
};

// Functions to emit events to the server
// Emitting "pre-offer" event, check app.js after this
export const sendPreOffer = (data) => {
  console.log("emitting to server pre offer event");
  socketIO.emit("pre-offer", data); // Defining the type of event
};

// This code sends an event from the callee side to the caller
export const sendPreOfferAnswer = (data) => {
  socketIO.emit("pre-offer-answer", data);
};

// Sending a webRTC request and exchanging sdp information || Signalling Channel
export const sendDataUsingWebRTCSignaling = (data) => {
  socketIO.emit("webRTC-signaling", data);
};

// Sending Hang Up request to the other person
export const sendUserHangUp = (data) => {
  socketIO.emit("user-hanged-up", data);
};
