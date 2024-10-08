import * as constants from "./constants.js";
import * as elements from "./elements.js";

export const updatePersonalCode = (personalCode) => {
  const personalCodeParagraph = document.getElementById(
    "personal_code_paragraph"
  );
  personalCodeParagraph.innerHTML = personalCode;
};

// This function will update the local video section in our ui
export const updateLocalVideo = (stream) => {
  const localVideo = document.getElementById("local_video");
  localVideo.srcObject = stream; // updates the source object of our video element

  //The loadedmetadata event occurs when metadata for the specified audio/video has been loaded.
  localVideo.addEventListener("loadedmetadata", () => {
    localVideo.play();
  });
};

export const updateRemoteStreamVideo = (stream) => {
  const remoteVideo = document.getElementById("remote_video");
  remoteVideo.srcObject = stream;
};

export const showIncomingCallDialog = (
  callType,
  acceptCallHandler,
  rejectCallHandler
) => {
  const callTypeInfo =
    callType === constants.callType.CHAT_PERSONAL_CODE ? "chat" : "video";

  const incomingCallDialog = elements.getIncomingCallDialog(
    callTypeInfo,
    acceptCallHandler,
    rejectCallHandler
  );

  // Removing all dialogs elements inside HTML
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
  dialog.appendChild(incomingCallDialog);
};

export const showCallingDialog = (rejectCallHandler) => {
  const callingDialog = elements.getCallingDialog(rejectCallHandler);

  // Removing all dialogs elements inside HTML
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
  dialog.appendChild(callingDialog);
};

export const showInfoDialog = (preOfferAnswer) => {
  let infoDialog = null;
  if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    infoDialog = elements.getInfoDialog(
      "Call rejected",
      "Callee rejected your call"
    );
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
    console.log("Callee Not Found man");
    infoDialog = elements.getInfoDialog(
      "Callee not found",
      "Please check your personal code"
    );
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    infoDialog = elements.getInfoDialog(
      "Call is not possible",
      "Probably callee is busy, please call again later"
    );
  }

  if (infoDialog) {
    const dialog = document.getElementById("dialog");
    dialog.appendChild(infoDialog);
    setTimeout(() => {
      removeAllDialogs();
    }, [4000]);
  }
};

export const removeAllDialogs = () => {
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
};

export const showCallElements = (callType) => {
  if (callType === constants.callType.CHAT_PERSONAL_CODE) {
    showChatCallElements();
  }

  if (callType === constants.callType.VIDEO_PERSONAL_CODE) {
    showVideoCallElements();
  }
};
export const showCallWindow = (callType) => {
  console.log("Working till here");
  if (callType === constants.callType.CHAT_PERSONAL_CODE) {
    showChatWindow();
  }

  if (callType === constants.callType.VIDEO_PERSONAL_CODE) {
    showVideoWindow();
  }
};
const showChatWindow = () => {
  // Show Chat Window
  const chatContainer = document.getElementById("messenger_container");
  const dashboard = document.getElementById("dashboard_container");
  dashboard.style.display = "none";
  chatContainer.style.display = "flex";
};
const showVideoWindow = () => {
  const callContainer = document.getElementById("call_container");
  const dashboard = document.getElementById("dashboard_container");
  dashboard.style.display = "none";
  callContainer.style.display = "flex";
};
export const hideCallWindow = (callType) => {
  if (callType === constants.callType.CHAT_PERSONAL_CODE) {
    hideChatWindow();
  }

  if (callType === constants.callType.VIDEO_PERSONAL_CODE) {
    hideVideoWindow();
  }
};
const hideChatWindow = () => {
  const chatContainer = document.getElementById("messenger_container");
  const dashboard = document.getElementById("dashboard_container");
  dashboard.style.display = "flex";
  chatContainer.style.display = "none";
};
const hideVideoWindow = () => {
  const callContainer = document.getElementById("call_container");
  const dashboard = document.getElementById("dashboard_container");
  dashboard.style.display = "flex";
  callContainer.style.display = "none";
};
const showChatCallElements = () => {
  const finishConnectionChatButtonContainer = document.getElementById(
    "finish_chat_button_container"
  );

  showElement(finishConnectionChatButtonContainer);
  const newMessageInput = document.getElementById("new_message");
  showElement(newMessageInput);
  disableDashboard();
};
const showVideoCallElements = () => {
  const callButtons = document.getElementById("call_buttons");
  showElement(callButtons);

  const placeholder = document.getElementById("videos_placeholder");
  hideElement(placeholder);

  const remoteVideo = document.getElementById("remote_video");
  showElement(remoteVideo);
  disableDashboard();
};

//  Ui messages

export const appendMessage = (message, right = false) => {
  const messagesContainer = document.getElementById("messages_container");
  const messageElement = right
    ? elements.getRightMessage(message)
    : elements.getLeftMessage(message);

  messagesContainer.append(messageElement);
};

export const clearMessenger = () => {
  const messagesContainer = document.getElementById("messages_container");
  messagesContainer.querySelectorAll("*").forEach((n) => n.remove());
};
// UI call buttons

const micOnImgSrc = "./utils/images/mic.png";
const micOffImgSrc = "./utils/images/micOff.png";
export const updateMicButton = (micActive) => {
  const micButtonImage = document.getElementById("mic_button_image");
  micButtonImage.src = micActive ? micOffImgSrc : micOnImgSrc;
};

const cameraOnImgSrc = "./utils/images/camera.png";
const cameraOffImgSrc = "./utils/images/cameraOff.png";
export const updateCameraButton = (cameraActive) => {
  const cameraButtonImage = document.getElementById("camera_button_image");
  cameraButtonImage.src = cameraActive ? cameraOffImgSrc : cameraOnImgSrc;
};

// Recording

export const showRecordingPanel = () => {
  const recordingButtons = document.getElementById("video_recording_buttons");
  showElement(recordingButtons);

  // hide start recording button if it is active
  const startRecordingButton = document.getElementById(
    "start_recording_button"
  );
  hideElement(startRecordingButton);
};

export const resetRecordingButtons = () => {
  const recordingButtons = document.getElementById("video_recording_buttons");

  const startRecordingButton = document.getElementById(
    "start_recording_button"
  );

  hideElement(recordingButtons);
  showElement(startRecordingButton);
};

export const switchRecordingButtons = (switchForResumeButton = false) => {
  const resumeButton = document.getElementById("resume_recording_button");
  const pauseButton = document.getElementById("pause_recording_button");

  if (switchForResumeButton) {
    hideElement(pauseButton);
    showElement(resumeButton);
  } else {
    hideElement(resumeButton);
    showElement(pauseButton);
  }
};

// UI after Hanging Up the call
export const updateUIAfterHangUp = (callType) => {
  enableDashboard();
  //hide call buttons
  if (
    callType === constants.callType.VIDEO_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_STRANGER
  ) {
    const callButtons = document.getElementById("call_buttons");
    hideElement(callButtons);
  } else {
    const chatCallButtons = document.getElementById(
      "finish_chat_button_container"
    );
    hideElement(chatCallButtons);
    const newMessageInput = document.getElementById("new_message");
    hideElement(newMessageInput);
    clearMessenger();
  }
  updateMicButton(false);
  updateCameraButton(false);

  // Hide Remote video and show placeholder
  const remoteVideo = document.getElementById("remote_video");
  hideElement(remoteVideo);
  const placeholder = document.getElementById("videos_placeholder");
  showElement(placeholder);
  removeAllDialogs();
};

// ui helper function

const enableDashboard = () => {
  const dashboardBlocker = document.getElementById("dashboard_blur");
  if (!dashboardBlocker.classList.contains("display_none")) {
    dashboardBlocker.classList.add("display_none");
  }
};

const disableDashboard = () => {
  const dashboardBlocker = document.getElementById("dashboard_blur");
  if (dashboardBlocker.classList.contains("display_none")) {
    dashboardBlocker.classList.remove("display_none");
  }
};

const hideElement = (element) => {
  if (!element.classList.contains("display_none")) {
    element.classList.add("display_none");
  }
};

const showElement = (element) => {
  if (element.classList.contains("display_none")) {
    element.classList.remove("display_none");
  }
};
