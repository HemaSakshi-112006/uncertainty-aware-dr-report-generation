
import os
import tensorflow as tf

# Path to the trained Model B
MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "model",
    "finetuned_60_layers.keras"
)

# Load the trained model
model = tf.keras.models.load_model(MODEL_PATH)

# DR class names
CLASS_NAMES = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative DR"
]


def predict_image(processed_image):

    # Generate predictions
    predictions = model.predict(processed_image, verbose=0)[0]

    # Find the class with the highest probability
    predicted_class = int(tf.argmax(predictions).numpy())

    # Convert probabilities into percentages
    probabilities = {
        CLASS_NAMES[i]: round(float(predictions[i]) * 100, 2)
        for i in range(len(CLASS_NAMES))
    }

    return {
        "predicted_class": CLASS_NAMES[predicted_class],
        "predicted_class_index": predicted_class,
        "class_probabilities": probabilities
    }
