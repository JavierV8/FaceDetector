
import './App.css';
import { useEffect } from 'react';

function App() {


  // LOAD OPENCV
  useEffect(() => {
    window.Module = {
      wasmBinaryFile: './opencv/opencv_js.wasm',
      _main: function() {alert("LOADED")}
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


  useEffect(() => {
    let imgElement = document.getElementById('srcImage')
    let inputElement = document.getElementById('fileInput');
    inputElement.addEventListener("change", (e) => {
      imgElement.src = URL.createObjectURL(e.target.files[0]);
    }, false);
    imgElement.onload = function() {
      let mat = window.cv.imread(imgElement);
      window.cv.cvtColor(mat, mat, window.cv.COLOR_RGBA2GRAY);
      window.cv.imshow('outputCanvas', mat);
      mat.delete();
    }
  }, [])

  return (
    <div className="App">
      <p id='status'>OpenCV.js (WebAssembly) is loading...</p>
      <input type='file' id='fileInput' accept='image/gif, image/jpeg, image/png'/>
      <div>
          <img id='srcImage' alt="img"></img>
          <canvas id='outputCanvas'></canvas>
      </div>
    </div>
  );
}

export default App;
