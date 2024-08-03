import * as wss from "./wss.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";

let connectedUserDetails;
// Sending connection request to another client
export const sendPreOffer = (callType, calleePersonalCode) => {
  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode,
  };

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const data = {
      callType,
      calleePersonalCode,
    };
    ui.showCallingDialog(callingDialogRejectCallHandler);
    wss.sendPreOffer(data); // Forwarding the callee details to web socket server
  }
};

// Handling connection request
export const handlePreOffer = (data) => {
  const { callType, callerSocketId } = data;
  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler); // Updating ui
  }
};

const acceptCallHandler = () => {
  console.log("Call Accepted");
};

const rejectCallHandler = () => {
  console.log("Call Rejected");
};

const callingDialogRejectCallHandler = () => {
  console.log("Rejecting the call");
};
