
import './App.css';
import { useEffect } from 'react';

function App() {

  // LOAD OPENCV
  useEffect(() => {
    window.Module = {
      wasmBinaryFile: './opencv/opencv_js.wasm',
     preRun: [function() {
       window.Module.FS_createPreloadedFile('/', 'haarcascade_eye.xml', './opencv/models/haarcascade_eye.xml', true, false);
       window.Module.FS_createPreloadedFile('/', 'haarcascade_frontalface_default.xml', './opencv/models/haarcascade_frontalface_default.xml', true, false);
       window.Module.FS_createPreloadedFile('/', 'haarcascade_profileface.xml', './opencv/models/haarcascade_profileface.xml', true, false);
     }],
     _main: function() {alert("LOADED!!!")}
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
  }, []);

  return (
    <div className="App">
      <div id="container">
          <canvas className="center-block" id="canvasOutput" width="320" height="240"></canvas>
      </div>
      <div className="text-center">
          <input type="checkbox" id="face" name="classifier" value="face" checked></input>
          <label for="face">face</label>
          <input type="checkbox" id="eye" name="cascade" value="eye"></input>
          <label for="eye">eye</label>
      </div>
      <div className="invisible">
          <video id="video" className="hidden">Your browser does not support the video tag.</video>
      </div>
    </div>
  );
}

export default App;