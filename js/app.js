// replace these values with those generated in your TokBox Account
var apiKey = '46855264';
var sessionId = '1_MX40Njg1NTI2NH5-MTYwNjM4MjY3OTQ3OH5OckpXUVNqa0dWRUtpemRteGoxc01FMU9-fg';
var token = 'T1==cGFydG5lcl9pZD00Njg1NTI2NCZzaWc9ZGNmYzI4Y2RlZWUxNjNmMmIzYmY5NWJjYzViYjc2ZDQ2NTJhNjk3YzpzZXNzaW9uX2lkPTFfTVg0ME5qZzFOVEkyTkg1LU1UWXdOak00TWpZM09UUTNPSDVPY2twWFVWTnFhMGRXUlV0cGVtUnRlR294YzAxRk1VOS1mZyZjcmVhdGVfdGltZT0xNjA2MzgyNjk3Jm5vbmNlPTAuODkxMzg0ODE5ODAwMDY5NiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjA2Mzg2Mjk3JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';


// create canvas on which DeepAR will render
var deepARCanvas = document.createElement('canvas');

// Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1572422
// canvas.captureStream causes an error if getContext not called before. Chrome does not need the line below.
var canvasContext = deepARCanvas.getContext('webgl'); 
var mediaStream = deepARCanvas.captureStream(25);
var videoTracks = mediaStream.getVideoTracks();

// start DeepAR
startDeepAR(deepARCanvas);

// start video call
initializeSession(videoTracks[0]);


// Handling all of our errors here by alerting them
function handleError(error) {
  console.log('handle error', error);
  if (error) {
    alert(error.message);
  }
}


function initializeSession(videoSource) {
  var session = OT.initSession(apiKey, sessionId);

  // Create a publisher
  var publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    videoSource: videoSource
  }, handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      console.log("SESSION CONNECT ERROR", error)
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

function startDeepAR(canvas) {

  var deepAR = DeepAR({ 
    canvasWidth: 640, 
    canvasHeight: 480,
    licenseKey: 'your_license_key_goes_here',
    segmentationInfoZip: './../deepar/segmentation.zip',
    canvas: canvas,
    numberOfFaces: 1,
    onInitialize: function() {
      // start video immediately after the initalization, mirror = true
      deepAR.startVideo(true);

      deepAR.switchEffect(0, 'slot', './effects/aviators', function() {
        // effect loaded
      });
    }
  });


  deepAR.downloadFaceTrackingModel('./deepar/models-68-extreme.bin');

  var filterIndex = 0;
  var filters = ['./effects/lion','./effects/flowers','./effects/dalmatian','./effects/background_segmentation','./effects/background_blur','./effects/aviators'];
  var changeFilterButton = document.getElementById('change-filter-button');
  changeFilterButton.onclick = function() {
    filterIndex = (filterIndex + 1) % filters.length;
    deepAR.switchEffect(0, 'slot', filters[filterIndex]);
  }


  // Because we have to use a canvas to render to and then stream to the
  // Vonage publisher, changing tabs has to pause the video streaming otherwise it will cause a crash
  // by pausing the 'window.requestAnimationFrame', more can be seen in the documentation:
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  var visible = true;
  document.addEventListener("visibilitychange", function (event) {
    visible = !visible;
    // pause and resume are not required, but it will pause the calls to 'window.requestAnimationFrame' 
    // and the entire rendering loop, which should improve general performance and battery life
    if (!visible) {
      deepAR.pause()
      deepAR.stopVideo();
    } else {
      deepAR.resume();
      deepAR.startVideo(true)
    }
  })
}



