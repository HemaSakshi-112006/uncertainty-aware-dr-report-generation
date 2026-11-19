from services.model_prediction import predict_image
from services.image_processing import preprocess_image
from services.llm_report import generate_report

# Load test image
with open("test_images/test_image.png", "rb") as file:
    image_bytes = file.read()

# CNN prediction
processed_image = preprocess_image(image_bytes)
prediction_result = predict_image(processed_image)

# Generate Zero-Shot report
report = generate_report(prediction_result)

print("\nZERO-SHOT GENERATED REPORT")
print("=" * 60)
print(report)