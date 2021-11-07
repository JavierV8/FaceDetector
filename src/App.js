/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import './App.css';

const App = () => {
  const videoRef = useRef(null);
  const outputCanvas = useRef(null);
  const detectionCanvas = useRef(null);
  const [faceClassifier, setFaceClassifier] = useState(null);
  const [srcMat, setSRCMat] = useState(null);
  const [grayMat, setGrayMat] = useState(null);
  const [detectionCanvasCtx, setDetectionCanvasCtx] = useState(null);
  const [outputCanvasCtx, setOutputCanvasCtx] = useState(null);

    // LOAD OPENCV
  useEffect(() => {
    loadOpenCV();
  }, []);

  // Load frontalFace Model
  useEffect(() => {
    if (faceClassifier) {
      try {
        faceClassifier.load('haarcascade_frontalface_default.xml');
        processVideo();
      }catch (e) {
        console.log("ERROR LOADING MODEL", e)
      }
    }
  }, [faceClassifier]);

  const loadOpenCV = () => {
    window.Module = {
      wasmBinaryFile: process.env.PUBLIC_URL + '/opencv/opencv_js.wasm',
     preRun: [function() {
       window.Module.FS_createPreloadedFile('/', 'haarcascade_eye.xml', process.env.PUBLIC_URL + '/opencv/models/haarcascade_eye.xml', true, false);
       window.Module.FS_createPreloadedFile('/', 'haarcascade_frontalface_default.xml', process.env.PUBLIC_URL + '/opencv/models/haarcascade_frontalface_default.xml', true, false);
       window.Module.FS_createPreloadedFile('/', 'haarcascade_profileface.xml', process.env.PUBLIC_URL + '/opencv/models/haarcascade_profileface.xml', true, false);
     }],
     _main: function() {
       console.log("LOADED!!!");
       launchVideoCamera();
      }
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
    script.setAttribute('src', process.env.PUBLIC_URL + '/opencv/opencv.js');
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
      const stream = await window.navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      console.log("Video PLAYED!")
      startVideoProcessing()
    } catch (e) {
      console.log("ERRROR CAMERA", e)
    }
  };

  const startVideoProcessing = () => {
    detectionCanvas.current.width = videoRef.current.videoWidth;
    detectionCanvas.current.height = videoRef.current.videoHeight;
    outputCanvas.current.width = videoRef.current.videoWidth;
    outputCanvas.current.height = videoRef.current.videoHeight;
    videoRef.current.style.height = outputCanvas.current.height + "px";
    

    setDetectionCanvasCtx(detectionCanvas.current.getContext('2d'));
    setOutputCanvasCtx(outputCanvas.current.getContext('2d'));

    setSRCMat(new window.cv.Mat(videoRef.current.videoHeight, videoRef.current.videoWidth, window.cv.CV_8UC4));
    setGrayMat(new window.cv.Mat(videoRef.current.videoHeight, videoRef.current.videoWidth, window.cv.CV_8UC1));

    setFaceClassifier(new window.cv.CascadeClassifier());
  }

  const drawResults = (ctx, results, color, size) => {
    for (let i = 0; i < results.length; ++i) {
      let rect = results[i];
      let xRatio = videoRef.current.videoWidth/size.width;
      let yRatio = videoRef.current.videoHeight/size.height;
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.strokeRect(rect.x*xRatio, rect.y*yRatio, rect.width*xRatio, rect.height*yRatio);
    }
  }

  const processVideo = () => {
    //Paint frame to canvas
    outputCanvasCtx.clearRect(0, 0, outputCanvas.current.width, outputCanvas.current.height);
    detectionCanvasCtx.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
    let imageData = detectionCanvasCtx.getImageData(0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
    srcMat.data.set(imageData.data);
    window.cv.cvtColor(srcMat, grayMat, window.cv.COLOR_RGBA2GRAY);
    let faces = [];
    let size;
    let faceVect = new window.cv.RectVector();
    let faceMat = new window.cv.Mat();
    window.cv.pyrDown(grayMat, faceMat);
    window.cv.pyrDown(faceMat, faceMat);
    size = faceMat.size();
    faceClassifier.detectMultiScale(faceMat, faceVect);
    for (let i = 0; i < faceVect.size(); i++) {
      let face = faceVect.get(i);
      faces.push(new window.cv.Rect(face.x, face.y, face.width, face.height));
    }
    faceMat.delete();
    faceVect.delete();
    drawResults(outputCanvasCtx, faces, 'red', size);
    requestAnimationFrame(processVideo);
  }

  return (
    <div className="App">
      <h1 className="title">OpenCV Haar Cascades for Face Detection</h1>
        <video
          ref={videoRef}
          className="videoCamera"
        />
        <canvas className="videoOutput" ref={outputCanvas}></canvas>
        <canvas className="videoCamera detectionCanvas" ref={detectionCanvas}></canvas>
    </div>
  );
};

export default App;


