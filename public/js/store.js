// 1) All the state in our application
let state = {
  socketId: null,
  localStream: null,
  remoteStream: null,
  screenSharingActive: false,
  screenSharingStream: null,
  allowConnectionsFromStrangers: false,
};

// 2) Setter Methods
export const setSocketId = (socketId) => {
  state = {
    ...state,
    socketId,
  };
  console.log(state);
};

export const setLocalStream = (stream) => {
  state = {
    ...state,
    localStream: stream,
  };
};

export const setAllowConnectionsFromStrangers = (allowConnection) => {
  state = {
    ...state,
    allowConnectionsFromStrangers: allowConnection,
  };
};

export const setScreenSharingActive = (screenSharingActive) => {
  state = {
    ...state,
    screenSharingActive,
  };
};

export const setScreenSharingStream = (stream) => {
  state = {
    ...state,
    screenSharingStream: stream,
  };
};

export const setRemoteStream = (stream) => {
  state = {
    ...state,
    remoteStream: stream,
  };
};

// 3) Getter Methods
export const getState = () => {
  return state;
};