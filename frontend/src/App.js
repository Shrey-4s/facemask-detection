import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectMask = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/detect", // Change to server URL when deployed
        { image: selectedImage },
        { headers: { "Content-Type": "application/json" } }
      );

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error detecting mask:", error);
      alert("Failed to detect mask. Check console for details.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Face Mask Detection</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {selectedImage && <img src={selectedImage} alt="Uploaded" width="200" />}
      <br />
      <button onClick={handleDetectMask} style={{ marginTop: "10px" }}>
        Detect Mask
      </button>
      {prediction && <h3>Prediction: {prediction}</h3>}
    </div>
  );
};

export default App;
