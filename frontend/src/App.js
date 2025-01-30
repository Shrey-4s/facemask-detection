import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);  // Store the File object
    }
  };

  const handleDetectMask = async () => {
    if (!selectedFile) {
      alert("Please upload an image first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", selectedFile); // Key must match backend's 'image'
  
    try {
      const response = await axios.post(
        "http://localhost:5000/detect",
        formData,
        // REMOVE manual content-type header - let browser set it automatically
      );
  
      setPrediction(response.data.mask);
    } catch (error) {
      console.error("Error detecting mask:", error.response?.data);
      alert(`Error: ${error.response?.data?.error || "Server error"}`);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Face Mask Detection</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {previewImage && <img src={previewImage} alt="Uploaded" width="200" />}
      <br />
      <button onClick={handleDetectMask} style={{ marginTop: "10px" }}>
        Detect Mask
      </button>
      {prediction && <h3>Prediction: {prediction}</h3>}
    </div>
  );
};

export default App;