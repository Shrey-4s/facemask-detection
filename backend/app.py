from flask import Flask, request, jsonify
from flask_cors import CORS  # Importing CORS
import base64
import cv2
import numpy as np

app = Flask(__name__)

# Enable CORS for all domains (you can also specify specific domains instead of '*')
CORS(app)

@app.route('/detect', methods=['POST'])
def detect_mask():
    data = request.get_json()
    img_data = base64.b64decode(data['image'])
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Perform prediction with your model
    prediction = "Mask"  # Replace this with your actual prediction logic
    return jsonify({"prediction": prediction})

if __name__ == '__main__':
    app.run(debug=True)
