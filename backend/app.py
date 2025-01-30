from flask import Flask, request, jsonify
import base64
from io import BytesIO
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from all origins (modify if needed)

@app.route('/detect', methods=['POST'])
def detect_mask():
    try:
        data = request.get_json()

        if not data or "image" not in data:
            return jsonify({"error": "Invalid JSON or missing 'image' key"}), 400

        # Extract Base64 string and remove metadata if present
        base64_string = data["image"]
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]

        # Decode Base64 image
        image_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_data))

        # Perform model prediction (Replace this with your actual model code)
        prediction = "Mask"  # Placeholder for actual prediction logic

        return jsonify({"prediction": prediction})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)  # Change host if deploying on a server
