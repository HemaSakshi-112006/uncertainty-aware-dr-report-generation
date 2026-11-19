
from services.model_prediction import predict_image
from services.image_processing import preprocess_image
from services.prompt_templates import build_few_shot_prompt

# Load test image
with open("test_images/test_image.png", "rb") as file:
    image_bytes = file.read()

# Generate CNN prediction
processed_image = preprocess_image(image_bytes)
prediction_result = predict_image(processed_image)

# Construct Few-Shot prompt
prompt = build_few_shot_prompt(prediction_result)

# Display prompt
print("\nFEW-SHOT PROMPT")
print("=" * 60)
print(prompt)
