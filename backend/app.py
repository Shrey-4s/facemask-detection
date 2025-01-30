from flask import Flask, request, jsonify
import numpy as np
import cv2
import base64
from keras.models import load_model

app = Flask(__name__)

# Load Model
model = load_model("./MaskDetectionModel.h5")
results = {0: 'without mask', 1: 'mask'}

# Load Haar Cascade
haarcascade = cv2.CascadeClassifier("haarcascade_frontalface_alt2.xml")

def detect_mask(image_data):
    # Decode base64 image
    image_data = base64.b64decode(image_data)
    np_img = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    
    # Detect faces
    faces = haarcascade.detectMultiScale(img, scaleFactor=1.1, minNeighbors=5)
    
    if len(faces) == 0:
        return {"message": "No face detected", "status": "error"}
    
    for (x, y, w, h) in faces:
        face_img = img[y:y+h, x:x+w]
        resized_face = cv2.resize(face_img, (150, 150))
        normalized = resized_face / 255.0
        reshaped = np.reshape(normalized, (1, 150, 150, 3))
        
        result = model.predict(reshaped)
        label = np.argmax(result, axis=1)[0]
        
        return {"prediction": results[label], "status": "success"}
    
@app.route('/detect', methods=['POST'])
def detect():
    data = request.json
    if "image" not in data:
        return jsonify({"error": "No image provided"}), 400
    
    response = detect_mask(data["image"])
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
