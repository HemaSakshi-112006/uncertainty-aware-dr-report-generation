
from flask import Flask, jsonify, request
from flask_cors import CORS

import base64
import io
from PIL import Image

from services.image_processing import preprocess_image
from services.model_prediction import predict_image, model
from services.llm_report import generate_report
from services.gradcam import (
    create_gradcam_model,
    generate_gradcam,
    create_gradcam_overlay
)


# Initialize Flask application
app = Flask(__name__)
CORS(app)


# Create Grad-CAM model once when the application starts
gradcam_model = create_gradcam_model(model)


# Home route
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Diabetic Retinopathy Detection API is running!"
    })


# Image prediction route
@app.route("/api/predict", methods=["POST"])
def predict():

    # Check whether an image was uploaded
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:

        # Read uploaded image
        image_bytes = file.read()

        # Preprocess image
        processed_image = preprocess_image(image_bytes)

        # Generate CNN prediction
        result = predict_image(processed_image)

        # Generate Grad-CAM heatmap
        heatmap, predicted_class, predictions = generate_gradcam(
            processed_image,
            gradcam_model
        )

        # Create Grad-CAM overlay
        overlay = create_gradcam_overlay(
            image_bytes,
            heatmap
        )

        # Convert overlay into PNG format
        buffer = io.BytesIO()

        Image.fromarray(overlay).save(
            buffer,
            format="PNG"
        )

        # Encode image into Base64
        overlay_base64 = base64.b64encode(
            buffer.getvalue()
        ).decode("utf-8")

        # Add Grad-CAM overlay to prediction result
        result["gradcam_overlay"] = (
            "data:image/png;base64," + overlay_base64
        )

        # Return prediction and Grad-CAM result
        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    
# AI-generated screening report route
@app.route("/api/generate-report", methods=["POST"])
def generate_ai_report():

    data = request.get_json()

    if not data:
        return jsonify({"error": "No prediction data provided"}), 400

    try:
        report = generate_report(data)

        return jsonify({
            "ai_report": report
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Run Flask application
if __name__ == "__main__":
    app.run(debug=True, port=5000)
