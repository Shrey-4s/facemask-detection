import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const UploadPhoto = () => {
  const [preview, setPreview] = useState(null);
  const [faces, setFaces] = useState([]);
  const [file, setFile] = useState(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFaces([]); // Reset previous results
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const detectFaces = async () => {
    if (!file) {
      alert('Please select an image first.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/detect`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setFaces(response.data.results);
    } catch (error) {
      console.error('Detection error:', error);
      alert(`Detection failed: ${error.message}`);
    }
  };

  const drawFaces = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.forEach(face => {
      ctx.strokeStyle = face.label === 'mask' ? '#28a745' : '#dc3545';
      ctx.lineWidth = 2;
      ctx.strokeRect(face.x, face.y, face.width, face.height);
      
      ctx.fillStyle = face.label === 'mask' ? '#28a745' : '#dc3545';
      ctx.fillRect(face.x, face.y - 20, face.width, 20);
      
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.fillText(
        `${face.label === 'mask' ? 'Mask' : 'No Mask'} (${Math.round(face.confidence * 100)}%)`,
        face.x + 5,
        face.y - 5
      );
    });
  };

  // Redraw faces when results or image changes
  useEffect(() => {
    drawFaces();
  }, [faces, preview]);

  return (
    <div className="upload-section">
      <div className="mb-4">
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="form-control" 
          accept="image/*"
        />
        <button 
          onClick={detectFaces} 
          className="btn btn-primary mt-2"
          disabled={!file}
        >
          Detect Masks
        </button>
      </div>

      {preview && (
        <div className="position-relative mt-3">
          <img 
            ref={imgRef} 
            src={preview} 
            alt="Preview" 
            className="img-fluid rounded shadow"
            onLoad={drawFaces}
          />
          <canvas
            ref={canvasRef}
            className="position-absolute top-0 start-0"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      )}

      {faces.length > 0 && (
        <div className="results-section mt-4">
          <div className="row g-3">
            {faces.map((face, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className={`card ${face.label === 'mask' ? 'border-success' : 'border-danger'}`}>
                  <div className={`card-header ${face.label === 'mask' ? 'bg-success' : 'bg-danger'} text-white`}>
                    Face {index + 1}
                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      <i className={`bi ${face.label === 'mask' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                      Status: <strong>{face.label === 'mask' ? 'Masked' : 'No Mask'}</strong>
                    </p>
                    <p className="card-text">
                      Confidence: {Math.round(face.confidence * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`alert ${
            faces.every(f => f.label === 'mask') 
              ? 'alert-success' 
              : 'alert-danger'
          } mt-4`}>
            <h4 className="alert-heading">
              {faces.every(f => f.label === 'mask') 
                ? 'All Faces Properly Masked! ✅' 
                : 'Mask Violation Detected! ⚠️'}
            </h4>
            <p>
              {faces.filter(f => f.label !== 'mask').length > 0 
                ? `${faces.filter(f => f.label !== 'mask').length} face(s) without mask detected!`
                : 'All faces are wearing masks properly.'}
            </p>
          </div>
        </div>
      )}

      {faces.length === 0 && preview && (
        <div className="alert alert-warning mt-4">
          <i className="bi bi-exclamation-circle me-2"></i>
          No faces detected in the image
        </div>
      )}
    </div>
  );
};

export default UploadPhoto;