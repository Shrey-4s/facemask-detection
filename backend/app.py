from tensorflow.keras.models import load_model
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image
import cv2

app = Flask(__name__)
CORS(app)

# Load the trained model (make sure to place the model file in your project directory)
model = load_model("MaskDetectionModel.h5")

@app.route('/detect', methods=['POST'])
def detect():
    try:
        # Extract the base64 image data from the request
        data = request.get_json()
        image_data = data['image']

        # Decode the base64 image data
        img_bytes = base64.b64decode(image_data)
        img = Image.open(BytesIO(img_bytes))
        
        # Convert the image to a format suitable for prediction (resize and convert to numpy array)
        img = img.resize((224, 224))  # Resize to match input size of the model
        img = np.array(img)  # Convert to numpy array
        img = img / 255.0  # Normalize if necessary
        
        # If the model requires a batch dimension (e.g., if it's a CNN), add it
        img = np.expand_dims(img, axis=0)

        # Perform prediction with your model
        prediction = model.predict(img)

        # Return the prediction result (e.g., 0: No mask, 1: Mask detected)
        result = "Mask" if prediction[0][0] > 0.5 else "No Mask"

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
