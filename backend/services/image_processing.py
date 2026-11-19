
import tensorflow as tf
import numpy as np
from PIL import Image
import io


def preprocess_image(image_bytes):

    # Read uploaded image
    image = Image.open(io.BytesIO(image_bytes))

    # Convert image to RGB
    image = image.convert("RGB")

    # Convert PIL image to NumPy array
    image = np.array(image)

    # Convert to TensorFlow tensor
    image = tf.convert_to_tensor(image)

    # Resize to 224 x 224
    image = tf.image.resize(image, [224, 224])

    # Apply the exact ResNet50 preprocessing
    image = tf.keras.applications.resnet50.preprocess_input(image)

    # Add batch dimension
    image = tf.expand_dims(image, axis=0)

    return image
