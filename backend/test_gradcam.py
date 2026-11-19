
from services.image_processing import preprocess_image
from services.model_prediction import model
from services.gradcam import create_gradcam_model, generate_gradcam

# Load the test image
with open("test_images/test_image.png", "rb") as file:
    image_bytes = file.read()

# Preprocess the image
processed_image = preprocess_image(image_bytes)

# Create the Grad-CAM model
gradcam_model = create_gradcam_model(model)

# Generate Grad-CAM heatmap
heatmap, predicted_class, predictions = generate_gradcam(
    processed_image,
    gradcam_model
)

print("Grad-CAM generated successfully!")
print("Heatmap shape:", heatmap.shape)
print("Predicted class index:", predicted_class)
print("Predicted class probability:",
      round(float(predictions[predicted_class]) * 100, 2), "%")
