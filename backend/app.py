import os
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
from flask_cors import CORS  # Add this import

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model
MODEL_PATH = "MaskDetectionModel.h5"
model = load_model(MODEL_PATH)

# Define image upload folder
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB

@app.route('/detect', methods=['POST'])
def detect_mask():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Save the image to a temporary folder
        img_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(img_path)

        # Load and process the image
        img = Image.open(img_path)
        img = img.resize((224, 224))  # Resize to the model's expected input size
        img = np.array(img) / 255.0  # Normalize
        img = np.expand_dims(img, axis=0)

        # Predict with the model
        prediction = model.predict(img)
        os.remove(img_path)
        
        if prediction[0][0] > prediction[0][1]:
            return jsonify({"mask": "No Mask Detected"}), 200
        else:
            return jsonify({"mask": "Mask Detected"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
