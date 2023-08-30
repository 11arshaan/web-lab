/*
INITIAL SETUP
*/

let video = document.getElementById("stream");
let canvas = document.getElementById("canvas");
let photo = document.getElementById("photo");




/*
Media Capture (for user devices)
*/

// this function is called when the user clicks the "Start Media Capture" button
// it will load the media stream into the video element
// to prevent blocking, the video is started via an event listener
async function startMediaCapture() {
  const constraints = {
    audio: false,
    video: { width: 1280, height: 720 },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream) => {
      video.srcObject = mediaStream;
      video.onloadedmetadata = () => {
        video.play();
      };
    })
    .catch((err) => {
      // always check for errors at the end.
      console.error(`${err.name}: ${err.message}`);
    });
}


/*
Display Capture (for screen capture)
*/
// similar to the media capture, except it will capture the screen
// note: this is not being used in the demo, but is included for reference
async function startDisplayCapture(displayMediaOptions) {
  let captureStream;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );
    video.srcObject = captureStream;
    video.onloadedmetadata = () => {
      video.play();
    };
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}


/*
Stop Stream
*/
// This will stop the stream and clear the video element
// Note: this will not clear the canvas or photo elements
//create a function to stop the stream
function stopStream(ev) {
  ev.preventDefault();
  const stream = video.srcObject;
  const tracks = stream.getTracks();
  
  tracks.forEach(function(track) {
    track.stop();
  });

  video.srcObject = null;
}


/*
Capture Frame
*/
// This uses a canvas element to store a frame from the stream
// The canvas can optionally process the frame before sending it to the photo element
// The photo element is an image element that can be consume the frame in dataurl format

function takePhoto(ev) {
  ev.preventDefault();
  const context = canvas.getContext("2d");
  if (video.videoWidth && video.videoHeight) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  } else {
    clearPhoto();
  }
}


/*
Clear Photo
*/
// This clears the photo element by filling the canvas with a solid color
// The photo element is then updated with the new canvas data

function clearPhoto() {
  const context = canvas.getContext("2d");
  context.fillStyle = "#FFF";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const data = canvas.toDataURL("image/png");
  photo.setAttribute("src", data);
}




document
  .getElementById("start-media")
  .addEventListener("click", startMediaCapture);
document
  .getElementById("stop-stream")
  .addEventListener("click", stopStream);
document.getElementById("take-photo").addEventListener("click", takePhoto);
document.getElementById("clear-photo").addEventListener("click", clearPhoto);
