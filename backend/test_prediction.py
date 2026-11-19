
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
print("\nPrediction Result")
print("-------------------------")

print("Predicted DR Grade:", result["predicted_class"])
print("Predicted Class Index:", result["predicted_class_index"])

print("\nClass Probabilities:")

for grade, probability in result["class_probabilities"].items():
    print(f"{grade}: {probability}%")
