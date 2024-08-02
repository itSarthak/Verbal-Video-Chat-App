export const getIncomingCallDialog = (
  callTypeInfo,
  acceptCallHandler,
  rejectCallHandler
) => {
  console.log("Getting incoming call dailog");

  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");

  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);

  // Title
  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Incoming ${callTypeInfo} Call`;

  // Profile Element/ Image
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");

  const image = document.createElement("img");
  const avatarImagePath = "./utils/images/dialogAvatar.png";
  image.src = avatarImagePath;
  imageContainer.appendChild(image);

  // Button Container | Contains Accept and Reject options
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("dialog_button_container");

  // Accept Call Button
  const acceptCallButton = document.createElement("button");
  acceptCallButton.classList.add("dialog_accept_call_button");
  buttonContainer.appendChild(acceptCallButton);

  const acceptCallImg = document.createElement("img");
  acceptCallImg.classList.add("dialog_button_image");
  const acceptCallImgPath = "./utils/images/acceptCall.png";
  acceptCallImg.src = acceptCallImgPath;
  acceptCallButton.appendChild(acceptCallImg);

  // Reject call button
  const rejectCallButton = document.createElement("button");
  rejectCallButton.classList.add("dialog_reject_call_button");
  buttonContainer.appendChild(rejectCallButton);

  const rejectCallImg = document.createElement("img");
  rejectCallImg.classList.add("dialog_button_image");
  const rejectCallImgPath = "./utils/images/rejectCall.png";
  rejectCallImg.src = rejectCallImgPath;
  rejectCallButton.appendChild(rejectCallImg);

  dialogContent.appendChild(title);
  dialogContent.appendChild(imageContainer);
  dialogContent.appendChild(buttonContainer);

  return dialog;
};
