import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function App() {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const base64Image = imageSrc.split(",")[1];

    try {
      const response = await axios.post("http://127.0.0.1:5000/detect", {
        image: base64Image
      });
      setResult(response.data.prediction);
    } catch (error) {
      console.error("Error detecting mask", error);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2>Face Mask Detection</h2>
      <Webcam ref={webcamRef} screenshotFormat="image/png" />
      <button className="btn btn-primary mt-3" onClick={captureImage}>
        Detect Mask
      </button>
      {result && <h3 className="mt-3">Result: {result}</h3>}
    </div>
  );
}

export default App;
