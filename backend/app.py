from flask import Flask, request, jsonify
import base64
import cv2
import numpy as np

app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect_mask():
    data = request.get_json()
    img_data = base64.b64decode(data['image'])
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Predict with your trained model
    prediction = "Mask"  # For now, just as a placeholder
    return jsonify({"prediction": prediction})

if __name__ == '__main__':
    app.run(debug=True)
