
import cv2
import numpy as np
import matplotlib.pyplot as plt

from PIL import Image
from services.image_processing import preprocess_image
from services.model_prediction import model
from services.gradcam import create_gradcam_model, generate_gradcam

# Load original image
image_path = "test_images/test_image.png"
original_image = Image.open(image_path).convert("RGB")
original_image = original_image.resize((224, 224))
original_image = np.array(original_image)

# Preprocess image
with open(image_path, "rb") as file:
    image_bytes = file.read()

processed_image = preprocess_image(image_bytes)

# Generate Grad-CAM
gradcam_model = create_gradcam_model(model)
heatmap, predicted_class, predictions = generate_gradcam(
    processed_image,
    gradcam_model
)

# Resize heatmap to image dimensions
heatmap_resized = cv2.resize(
    heatmap, (224, 224), interpolation=cv2.INTER_LINEAR
)

# Convert heatmap to color
heatmap_uint8 = np.uint8(255 * heatmap_resized)
heatmap_colored = cv2.applyColorMap(
    heatmap_uint8, cv2.COLORMAP_JET
)

# Convert BGR to RGB
heatmap_colored = cv2.cvtColor(
    heatmap_colored, cv2.COLOR_BGR2RGB
)

# Create overlay
overlay = cv2.addWeighted(
    original_image, 0.6,
    heatmap_colored, 0.4, 0
)

# Display all three images
plt.figure(figsize=(15, 5))

plt.subplot(1, 3, 1)
plt.imshow(original_image)
plt.title("Original Retinal Image")
plt.axis("off")

plt.subplot(1, 3, 2)
plt.imshow(heatmap_resized, cmap="jet")
plt.title("Grad-CAM Heatmap")
plt.axis("off")

plt.subplot(1, 3, 3)
plt.imshow(overlay)
plt.title("Grad-CAM Overlay")
plt.axis("off")

plt.tight_layout()
plt.show()

print("Predicted class index:", predicted_class)
print("Predicted probability:",
      round(float(predictions[predicted_class]) * 100, 2), "%")
