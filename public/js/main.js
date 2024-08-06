import * as store from "./store.js"; // Contains all the states of our application
import * as wss from "./wss.js"; // Web Socket Server connection and calling request handler
import * as webRTCHandler from "./webRTCHandler.js"; // Handles all the request related to web Socket
import * as constants from "./constants.js"; // Handling calls

// Initialization of socket io connection || Server Side
const socket = io("/");
wss.registerSocketEvents(socket);

webRTCHandler.getLocalPreview(); // Turning client's camera on

// Registering event listener for personal code copy
const personalCodeCopyButton = document.getElementById(
  "personal_code_copy_button"
);
personalCodeCopyButton.addEventListener("click", () => {
  const personalCode = store.getState().socketId;
  navigator.clipboard && navigator.clipboard.writeText(personalCode);
});

// Registering event listener for connection buttons (Chat/Call)
const personalCodeChatButton = document.getElementById(
  "personal_code_chat_button"
);

const personalCodeVideoButton = document.getElementById(
  "personal_code_video_button"
);

personalCodeChatButton.addEventListener("click", () => {
  console.log("Chat Button Clicked!");
  const calleePersonalCode = document.getElementById(
    "personal_code_input"
  ).value;
  const callType = constants.callType.CHAT_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, calleePersonalCode); // Sending chat call request to the server
});

personalCodeVideoButton.addEventListener("click", () => {
  console.log("Video Button Clicked!");
  const calleePersonalCode = document.getElementById(
    "personal_code_input"
  ).value;
  const callType = constants.callType.VIDEO_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
});
