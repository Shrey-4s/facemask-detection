from flask import Flask, request, jsonify
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = load_model("MaskDetectionModel.h5", compile=False)
face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_alt2.xml")
rect_size = 4
labels = {0: 'without mask', 1: 'mask'}
colors = {0: (0, 0, 255), 1: (0, 255, 0)}

def process_image(img):
    resized = cv2.resize(img, (img.shape[1] // rect_size, img.shape[0] // rect_size))
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    results = []
    for (x, y, w, h) in faces:
        x, y, w, h = [v * rect_size for v in (x, y, w, h)]
        face_img = img[y:y+h, x:x+w]
        resized_face = cv2.resize(face_img, (150, 150))
        normalized = resized_face / 255.0
        prediction = model.predict(normalized.reshape(1, 150, 150, 3))
        label = np.argmax(prediction)
        
        results.append({
            "x": int(x),
            "y": int(y),
            "width": int(w),
            "height": int(h),
            "label": labels[label],
            "confidence": float(prediction[0][label])
        })
    return results

@app.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read the file into a numpy array
        npimg = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        
        # Process the image
        results = process_image(img)
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)