import * as store from "./store.js"; // Contains all the states of our application
import * as wss from "./wss.js"; // Web Socket Server connection and calling request handler
import * as webRTCHandler from "./webRTCHandler.js"; // Handles all the request related to web Socket
import * as constants from "./constants.js"; // Handling calls
import * as ui from "./ui.js";
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

// Send a chat connection request
personalCodeChatButton.addEventListener("click", () => {
  console.log("Chat Button Clicked!");
  const calleePersonalCode = document.getElementById(
    "personal_code_input"
  ).value;
  const callType = constants.callType.CHAT_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, calleePersonalCode); // Sending chat call request to the server
});

// Send a video call request
personalCodeVideoButton.addEventListener("click", () => {
  console.log("Video Button Clicked!");
  const calleePersonalCode = document.getElementById(
    "personal_code_input"
  ).value;
  const callType = constants.callType.VIDEO_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
});

// Event Listener for video call buttons
const micButton = document.getElementById("mic_button");
micButton.addEventListener("click", () => {
  const localStream = store.getState().localStream;
  const micEnabled = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks()[0].enabled = !micEnabled;
  ui.updateMicButton(micEnabled);
});

const cameraButton = document.getElementById("camera_button");
cameraButton.addEventListener("click", () => {
  const localStream = store.getState().localStream;
  const cameraEnabled = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks()[0].enabled = !cameraEnabled;
  ui.updateCameraButton(cameraEnabled);
});

const switchForScreenSharingButton = document.getElementById(
  "screen_sharing_button"
);
switchForScreenSharingButton.addEventListener("click", () => {
  const screenSharingActive = store.getState().screenSharingActive;
  webRTCHandler.switchBetweenCameraAndScreenSharing(screenSharingActive);
});
