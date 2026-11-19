from services.model_prediction import predict_image
from services.image_processing import preprocess_image
from services.prompt_templates import build_zero_shot_prompt

# Load the same test image
with open("test_images/test_image.png", "rb") as file:
    image_bytes = file.read()

# Preprocess and predict
processed_image = preprocess_image(image_bytes)
prediction_result = predict_image(processed_image)

# Build Zero-Shot prompt
prompt = build_zero_shot_prompt(prediction_result)

# Display prompt
print("ZERO-SHOT PROMPT")
print("=" * 60)
print(prompt)