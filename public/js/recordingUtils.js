import * as store from "./store.js";

let mediaRecorder; // We use media recorder api to records videos, know more here -> https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
/*
 ** Why do we need a CODEC?
 ** A codec compresses or decompresses media files (audio/video)
 ** When recording, we are essentially working with streams, to save those
 ** streams in a video format we need something that can encode our streams
 ** into videos. That is why we require a codec
 */

const vp9Codec = "video/webm; codecs=vp=9"; // Vp9 is a type of many availible codecs

/*
 ** MIME is a standard to describe documents in formats other than traditionals
 ** it return the media type object which was specified when created that object
 */

const vp9Options = { mimeType: vp9Codec };
const recordedChunks = [];

export const startRecording = () => {
  const remoteStream = store.getState().remoteStream;

  // Checing if our browser supports defined video codec
  if (MediaRecorder.isTypeSupported(vp9Codec)) {
    mediaRecorder = new MediaRecorder(remoteStream, vp9Options);
  } else {
    mediaRecorder = new MediaRecorder(remoteStream);
  }

  mediaRecorder.ondataavailable = handleDataAvailible;
  mediaRecorder.start();
};

// Various methods for video interactions
export const pauseRecording = () => {
  mediaRecorder.pause();
};

export const resumeRecording = () => {
  mediaRecorder.resume();
};

export const stopRecording = () => {
  mediaRecorder.stop();
};

const downloadRecordedVideo = () => {
  /*
   ** BLOB is a type of Data Structure that can store raw data in a file like format
   ** In our recordedChunks array, the data type saved is alread in blob,
   ** we take that blob and convert it into video format
   */
  const blob = new Blob(recordedChunks, {
    type: "video/webm",
  });
  console.log(recordedChunks);
  console.log(blob);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none;";
  a.href = url;
  a.download = "recording.webm";
  a.click();
  window.URL.revokeObjectURL(url);
};

const handleDataAvailible = (event) => {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    downloadRecordedVideo();
  }
};
