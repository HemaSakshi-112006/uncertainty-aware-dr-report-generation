
import tensorflow as tf
import os

MODEL_PATH = os.path.join(
    "model",
    "finetuned_60_layers.keras"
)

model = tf.keras.models.load_model(MODEL_PATH)

print("Model B loaded successfully!")
print("Input shape:", model.input_shape)
print("Output shape:", model.output_shape)
print("Number of parameters:", model.count_params())
