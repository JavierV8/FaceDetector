import React, { useEffect, useRef } from "react";
import './App.css';

const App = () => {
  const videoRef = useRef(null);

    // LOAD OPENCV
  useEffect(() => {
      loadOpenCV();
  }, []);

  useEffect(() => {
    launchVideoCamera();
  }, []);

  const loadOpenCV = () => {
    window.Module = {
      wasmBinaryFile: './opencv/opencv_js.wasm',
     preRun: [function() {
       window.Module.FS_createPreloadedFile('/', 'haarcascade_eye.xml', './opencv/models/haarcascade_eye.xml', true, false);
       window.Module.FS_createPreloadedFile('/', 'haarcascade_frontalface_default.xml', './opencv/models/haarcascade_frontalface_default.xml', true, false);
       window.Module.FS_createPreloadedFile('/', 'haarcascade_profileface.xml', './opencv/models/haarcascade_profileface.xml', true, false);
     }],
     _main: function() {console.log("LOADED!!!")}
   };
  
    // CV script fails to load
    const onCVLoadError = () => {
      console.error('Failed to load/initialize cv.js');
    };
    // Start the VDVideo SDK after CV script is initialized
    const onRuntimeInitialized = () => {
      if (window.cv) {
        if (window.cv instanceof Promise) {
          window.cv.then(target => {
            window.cv = target;
            console.log("1LOAD")
          });
        } else {
          console.log("1LOAD")
        }
      }
    };
    const script = document.createElement('script');
    script.setAttribute('src', './opencv/opencv.js');
    script.setAttribute('type', 'application/javascript');
    script.addEventListener('load', () => onRuntimeInitialized());
    script.addEventListener('error', () => onCVLoadError());
    document.head.appendChild(script);
  }

  const launchVideoCamera = async () => {
    const constraints = {
      video: {
        width: 1280, 
        height: 720,
        facingMode: "user",
      },
      audio: false,
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      //setStreams(stream);
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      console.log("Video PLAYED!")
    } catch {
      console.log("WWW")
    }
  };

  return (
    <div className="App">
        <video
          ref={videoRef}
          className="videoCamera"
        />
    </div>
  );
};

export default App;


