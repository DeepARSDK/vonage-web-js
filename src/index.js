import * as deepar from 'deepar';
import OT from '@opentok/client';

// Log the version. Just in case.
console.log("Deepar version: " + deepar.version);

// replace these values with those generated in your TokBox Account
const apiKey = '47571901';
const sessionId = '1_MX40NzU3MTkwMX5-MTY2MzE4MDE0NjQ1M35iK010bkFnTzlXRFNLU2VIczJQQXZ4c0N-fg';
const token = 'T1==cGFydG5lcl9pZD00NzU3MTkwMSZzaWc9ZDQyNjI1MTBkOWZiMGU4MDQ3MjIzYjk0MDg4YTllODU2NmQ0YThiOTpzZXNzaW9uX2lkPTFfTVg0ME56VTNNVGt3TVg1LU1UWTJNekU0TURFME5qUTFNMzVpSzAxMGJrRm5UemxYUkZOTFUyVkljekpRUVhaNGMwTi1mZyZjcmVhdGVfdGltZT0xNjYzMTgwMTQ2Jm5vbmNlPTAuNjY0MjcwMzMyNzA1OTU5NCZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNjYzMTgxOTQ2JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';


// create canvas on which DeepAR will render
const deepARCanvas = document.createElement('canvas');

// Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1572422
// canvas.captureStream causes an error if getContext not called before. Chrome does not need the line below.
const canvasContext = deepARCanvas.getContext('webgl'); 
const mediaStream = deepARCanvas.captureStream(30);
const videoTracks = mediaStream.getVideoTracks();

// Top-level await is not supported.
// So we wrap the whole code in an async function that is called immediatly.
(async function() {

// Initialize DeepAR with an effect file.
const deepAR = await deepar.initialize({
  licenseKey: 'your_license_key_here',
  canvas: deepARCanvas,
  effect: 'effects/aviators',
  rootPath: "deepar-resources" // See webpack.config.js and package.json build script.
});

// start video call
initializeSession(videoTracks[0]);


// Handling all of our errors here by alerting them
function handleError(error) {
  console.error('handle error', error);
  if (error) {
    alert(error.message);
  }
}


function initializeSession(videoSource) {
  const session = OT.initSession(apiKey, sessionId);

  // Create a publisher
  const publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    videoSource: videoSource
  }, handleError);

  // Connect to the session
  session.connect(token, (error) => {
    // If the connection is successful, publish to the session
    if (error) {
      console.error("SESSION CONNECT ERROR", error)
      handleError(error);
    } else {
      console.log("SESSION CONNECT SUCCESS")
      session.publish(publisher, handleError);
    }
  });
  session.on('streamCreated', function(event) {
    console.log("STREAM CREATED", event)
    session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);
  });
}

let filterIndex = 0;
const filters = ['./effects/lion','./effects/flowers','./effects/dalmatian','./effects/background_segmentation','./effects/background_blur','./effects/aviators'];
const changeFilterButton = document.getElementById('change-filter-button');
changeFilterButton.onclick = async function() {
  filterIndex = (filterIndex + 1) % filters.length;
  await deepAR.switchEffect(filters[filterIndex]);
}


// Changing tabs usually pauses DeepAR rendering since requestAnimationFrame() will not be called by browsers.
// To bypass this behaviour, you can call deepAR.setOffscreenRenderingEnabled(true).
// It will force rendering even when tab is not focused by using it's internal timer.
// This is not recommended so we turn it off as soon as tab gets focus back.
let visible = true;
document.addEventListener("visibilitychange", function (event) {
  visible = !visible;
  if (!visible) {
    deepAR.setOffscreenRenderingEnabled(true);
  } else {
    deepAR.setOffscreenRenderingEnabled(false);
  }
})

})();