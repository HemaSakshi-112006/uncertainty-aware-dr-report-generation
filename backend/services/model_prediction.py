
import os
import numpy as np
import tensorflow as tf

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "model",
    "finetuned_60_layers.keras"
)

model = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative DR"
]


def predict_image(processed_image):

    predictions = model.predict(processed_image, verbose=0)[0]

    # Sort classes by probability
    sorted_indices = np.argsort(predictions)[::-1]

    # Top prediction
    top_index = int(sorted_indices[0])
    top_class = CLASS_NAMES[top_index]
    top_probability = float(predictions[top_index])

    # Second-highest prediction
    second_index = int(sorted_indices[1])
    second_class = CLASS_NAMES[second_index]
    second_probability = float(predictions[second_index])

    # Difference between top two probabilities
    top_two_gap = top_probability - second_probability

    # Normalized prediction entropy
    entropy = -np.sum(
        predictions * np.log(predictions + 1e-10)
    ) / np.log(5)

    # Class probabilities as percentages
    probabilities = {
        CLASS_NAMES[i]: round(float(predictions[i]) * 100, 2)
        for i in range(5)
    }

    # Structured CNN output
    return {
        "predicted_class": top_class,
        "predicted_class_index": top_index,

        "class_probabilities": probabilities,

        "softmax_probabilities": {
            CLASS_NAMES[i]: float(predictions[i])
            for i in range(5)
        },

        "maximum_probability": top_probability,

        "top_two_classes": [
            {
                "class": top_class,
                "probability": top_probability
            },
            {
                "class": second_class,
                "probability": second_probability
            }
        ],

        "top_two_probability_gap": float(top_two_gap),

        "normalized_entropy": float(entropy)
    }
