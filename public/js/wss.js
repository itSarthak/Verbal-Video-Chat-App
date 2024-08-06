import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRTCHandler from "./webRTCHandler.js";

let socketIO = null; // Init socketIo value, it will change once the connection is made

// Function to register Socket events
export const registerSocketEvents = (socket) => {
  socketIO = socket;
  socket.on("connect", () => {
    console.log("Successfully connected to socket.io server");
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
  });

  socket.on("pre-offer", (data) => {
    webRTCHandler.handlePreOffer(data);
  });

  socket.on("pre-offer-answer", (data) => {
    webRTCHandler.handlePreOfferAnswer(data);
  });
};

// Emitting "pre-offer" event, check app.js after this
export const sendPreOffer = (data) => {
  console.log("emitting to server pre offer event");
  socketIO.emit("pre-offer", data); // Defining the type of event
};

export const sendPreOfferAnswer = (data) => {
  socketIO.emit("pre-offer-answer", data);
};
