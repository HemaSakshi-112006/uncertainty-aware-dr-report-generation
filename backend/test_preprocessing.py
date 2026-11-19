
from services.image_processing import preprocess_image

with open("test_images/test_image.png", "rb") as file:
    image_bytes = file.read()

processed_image = preprocess_image(image_bytes)

print("Preprocessing successful!")
print("Image shape:", processed_image.shape)
print("Data type:", processed_image.dtype)
print("Minimum value:", float(processed_image.numpy().min()))
print("Maximum value:", float(processed_image.numpy().max()))
print("First 10 pixel values:")
print(processed_image.numpy().flatten()[:10])
