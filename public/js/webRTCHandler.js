import * as wss from "./wss.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";
import * as store from "./store.js";

let connectedUserDetails;
let peerConnection;
let dataChannel;
/*
 ** Default constraint is used to set
 ** the acccess of camera and mic
 */
const defaultConstraints = {
  audio: true,
  video: true,
};

/*
 ** ICE Candidates: ICE candidate is nothing more than an IP address and port, gathering ICE
 ** candidate is the process of finding all possible combinations of IP and PORT where a
 ** PEER is availible for new connection. During Signalling each peer is resonsible for
 ** gathering their own ICE candidates.
 */

/*
 ** ICE server helps in gathering/discovering ICE candidates.
 ** For more info -> https://medium.com/@mshuecodev/what-should-i-know-about-ice-server-ebed04f54369
 */
const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902",
    },
  ],
};

export const getLocalPreview = () => {
  // Local Preview turns on our camera and mic
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      ui.updateLocalVideo(stream);
      store.setLocalStream(stream); // We set the value of stream in our state management file
    })
    .catch((err) => {
      console.log("error occured when trying to get an access to camera");
      console.log(err);
    });
};

/*
 ** Since we need to create a Peer-to-Peer connection between both the clients,
 ** we'll now create a webRTC offer and send it to callee
 ** know more about peer-to-peer: https://www.spiceworks.com/tech/networking/articles/what-is-peer-to-peer/
 */
const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration); // RTCPeerConnection provied method to connect with remote peer

  dataChannel = peerConnection.createDataChannel("chat");

  peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;

    dataChannel.onopen = () => {
      console.log("peer connection is ready to recieve data channel messages");
    };

    dataChannel.onmessage = (event) => {
      console.log("Message came on data chennel");
      const message = JSON.parse(event.data);
      ui.appendMessage(message);
    };
  };

  peerConnection.onicecandidate = (event) => {
    console.log("Getting ICE candidate from STUN server"); // Means all the stun server is working perfectly to get al the
    // Event Listener for ice candidates
    if (event.candidate) {
      // send our ice candidates to other peer for them to check if their ice candidate can connect to any of them
      wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.ICE_CANDIDATE,
        candidate: event.candidate,
      });
    }
  };

  peerConnection.onconnectionstatechange = (event) => {
    /*
     ** Event Listener when the ICE candidates are successfuly
     ** exchanges and connected to availible one's
     */
    if (peerConnection.connectionState === "connected") {
      console.log("successfully connected with other peer");
    }
  };

  // recieve tracks
  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteStreamVideo(remoteStream);

  /*
   ** onTrack is event listener to listen for tracks from callee
   ** event.track contains both camera and audio streams
   */

  peerConnection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  };

  // Add our stream to peer connections

  if (
    // only send streams if the connection is video call
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const localStream = store.getState().localStream;

    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  }
};

export const sendMessageUsingDataChannel = (message) => {
  const stringifiedMessage = JSON.stringify(message);
  dataChannel.send(stringifiedMessage);
};

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
  createPeerConnection(); // Creating a peer connection when we send a call answer
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);

  if (
    navigator.userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i
    )
  ) {
    ui.showCallWindow(connectedUserDetails.callType);
  }
};

const rejectCallHandler = () => {
  console.log("Call Rejected");
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
};

const callingDialogRejectCallHandler = () => {
  console.log("Rejecting the call");
};

const sendPreOfferAnswer = (preOfferAnswer) => {
  const data = {
    callerSocketId: connectedUserDetails.socketId,
    preOfferAnswer,
  };
  ui.removeAllDialogs();
  wss.sendPreOfferAnswer(data);
};

export const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data;

  console.log("Pre Offer answer came");

  ui.removeAllDialogs();

  if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
    // Show dialog that callee is not found

    ui.showInfoDialog(preOfferAnswer);
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    // Show dialog that callee is not able to connect
    ui.showInfoDialog(preOfferAnswer);
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    // Show dialog that callee has rejected the call
    ui.showInfoDialog(preOfferAnswer);
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
    // Send WebRTC offer
    ui.showCallElements(connectedUserDetails.callType);
    // Check if the user is on Mobile device

    if (
      navigator.userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i
      )
    ) {
      ui.showCallWindow(connectedUserDetails.callType);
    }
    createPeerConnection();
    sendWebRTCOffer();
  }
};

// Sending WebRTC offer to our caller
/*
 ** Initiates the creation of an SDP offer for the purpose of
 ** starting a new WebRTC connection to a remote peer.
 ** know more here -> https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
 */

/*
 ** Changes the local description associated with the connection. This description
 ** specifies the properties of the local end of the connection, including the media format.
 */
const sendWebRTCOffer = async () => {
  // Two line of code below is
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.OFFER,
    offer: offer,
  });
};

// Handling WebRTC offer, save sdp information on callee as remote description and passw it's own
export const handleWebRTCOffer = async (data) => {
  await peerConnection.setRemoteDescription(data.offer); // Save the data as remote description

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.ANSWER,
    answer: answer,
  });
};

// Handling a webRTC offer is easy, just change the remote description
export const handleWebRTCAnswer = async (data) => {
  console.log("Handling webRTC Answer");
  await peerConnection.setRemoteDescription(data.answer);
};

export const handleWRCCandidate = async (data) => {
  try {
    await peerConnection.addIceCandidate(data.candidate);
  } catch (err) {
    console.log("error occured when trying to add recieved ice candidate", err);
  }
};

// Screen Sharing Logic
let screenSharingStream;
export const switchBetweenCameraAndScreenSharing = async (
  screenSharingActive
) => {
  if (screenSharingActive) {
    const localStream = store.getState().localStream;
    const senders = peerConnection.getSenders();

    const sender = senders.find((sender) => {
      return sender.track.kind == localStream.getVideoTracks()[0].kind;
    });

    if (sender) {
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    }

    // Stop screen sharing stream
    store
      .getState()
      .screenSharingStream.getTracks()
      .forEach((track) => track.stop());

    store.setScreenSharingActive(!screenSharingActive);
    ui.updateLocalVideo(localStream);
  } else {
    console.log("Switching For Screen Sharing");
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      store.setScreenSharingStream(screenSharingStream);

      // Replace track which sender is sending
      const senders = peerConnection.getSenders();

      const sender = senders.find((sender) => {
        return (
          sender.track.kind == screenSharingStream.getVideoTracks()[0].kind
        );
      });

      if (sender) {
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
      }
      store.setScreenSharingActive(!screenSharingActive);

      ui.updateLocalVideo(screenSharingStream);
    } catch (error) {
      console.log("error occured when trying to get screen sharing stream");
    }
  }
};

// Hang Up

export const handleHangUp = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  };

  wss.sendUserHangUp(data);
  closePeerConnectionAndResetState();
};

export const handleConnectedUserHangedUp = () => {
  closePeerConnectionAndResetState();
};

const closePeerConnectionAndResetState = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  // active mic and camera
  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === constants.callType.VIDEO_STRANGER
  ) {
    store.getState().localStream.getVideoTracks()[0].enabled = true;
    store.getState().localStream.getAudioTracks()[0].enabled = true;
    ui.updateUIAfterHangUp(connectedUserDetails.callType);
    if (
      navigator.userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i
      )
    ) {
      ui.hideCallWindow(connectedUserDetails.callType);
    }
    connectedUserDetails = null;
  }
};
