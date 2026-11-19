
from services.image_processing import preprocess_image
from services.model_prediction import predict_image

# Load a sample test image
with open("test_images/test_image.png", "rb") as file:
    image_bytes = file.read()

# Preprocess the image
processed_image = preprocess_image(image_bytes)

# Get Model B prediction
result = predict_image(processed_image)

# Display the result
print("Predicted Grade:", result["predicted_class"])

print("\nClass Probabilities:")
for name, probability in result["class_probabilities"].items():
    print(f"{name}: {probability}%")

print("\nMaximum Probability:", result["maximum_probability"])
print("Top Two Classes:", result["top_two_classes"])
print("Top Two Probability Gap:", result["top_two_probability_gap"])
print("Normalized Entropy:", result["normalized_entropy"])