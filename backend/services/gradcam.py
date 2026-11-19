
import tensorflow as tf
import numpy as np
import cv2

def create_gradcam_model(model):

    # Access the ResNet50 backbone
    resnet_model = model.get_layer("resnet50")

    # Access the classification layers
    gap_layer = model.get_layer("global_average_pooling2d")
    dropout_layer = model.get_layer("dropout")
    dense_layer = model.get_layer("dense")

    # Create a new input
    gradcam_input = tf.keras.Input(shape=(224, 224, 3))

    # Extract feature maps
    feature_maps = resnet_model(gradcam_input, training=False)

    # Recreate the classifier
    x = gap_layer(feature_maps)
    x = dropout_layer(x, training=False)
    predictions = dense_layer(x)

    return tf.keras.Model(
        inputs=gradcam_input,
        outputs=[feature_maps, predictions]
    )


def generate_gradcam(processed_image, gradcam_model):

    processed_image = tf.cast(processed_image, tf.float32)

    with tf.GradientTape() as tape:

        conv_outputs, predictions = gradcam_model(
            processed_image, training=False
        )

        predicted_class = tf.argmax(predictions[0])
        loss = predictions[:, predicted_class]

    grads = tape.gradient(loss, conv_outputs)

    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]

    heatmap = tf.reduce_sum(
        conv_outputs * pooled_grads,
        axis=-1
    )

    heatmap = tf.maximum(heatmap, 0)

    heatmap = heatmap / (
        tf.reduce_max(heatmap) + tf.keras.backend.epsilon()
    )

    return heatmap.numpy(), int(predicted_class.numpy()), predictions.numpy()[0]

def create_gradcam_overlay(image_bytes, heatmap):

    # Read original uploaded image
    image = tf.io.decode_image(image_bytes, channels=3)
    image = tf.image.resize(image, [224, 224])
    image = image.numpy().astype("uint8")

    # Resize heatmap to image dimensions
    heatmap = cv2.resize(heatmap, (224, 224))

    # Convert heatmap into colour representation
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Convert original RGB image to BGR
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    # Overlay heatmap on original image
    overlay = cv2.addWeighted(image, 0.6, heatmap, 0.4, 0)

    # Convert overlay back to RGB
    overlay = cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB)

    return overlay
