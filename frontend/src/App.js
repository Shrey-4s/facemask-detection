import React, { useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Capture the image from webcam
  const captureImage = async () => {
    setLoading(true);
    setError(null);
    const imageSrc = webcamRef.current.getScreenshot();
    const base64Image = imageSrc.split(",")[1];

    try {
      const response = await axios.post("http://127.0.0.1:5000/detect", {
        image: base64Image,
      });

      setResult(response.data.prediction);
      setLoading(false);
    } catch (error) {
      setError("Error detecting mask. Please try again.");
      setLoading(false);
      console.error("Error detecting mask", error);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4" style={{ fontWeight: 'bold', fontSize: '30px', color: '#007bff' }}>
        Face Mask Detection
      </h2>

      <div className="mb-3" style={{ border: '2px solid #007bff', padding: '5px', borderRadius: '10px' }}>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/png"
          width="100%"
          videoConstraints={{
            facingMode: "user",
            width: 640,
            height: 480
          }}
        />
      </div>

      <button
        className="btn btn-primary mt-3"
        onClick={captureImage}
        disabled={loading}
        style={{ fontWeight: 'bold', padding: '10px 20px' }}
      >
        {loading ? 'Detecting...' : 'Detect Mask'}
      </button>

      {result && (
        <div className="mt-4">
          <h3
            className="mt-3"
            style={{
              fontSize: '24px',
              color: result === 'Mask' ? 'green' : 'red',
              fontWeight: 'bold',
            }}
          >
            Result: {result}
          </h3>
        </div>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default App;
