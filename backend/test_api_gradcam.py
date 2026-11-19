
import requests
import base64

url = "http://127.0.0.1:5000/api/predict"

with open("test_images/test_image.png", "rb") as image_file:
    response = requests.post(
        url,
        files={"image": image_file}
    )

data = response.json()

image_data = data["gradcam_overlay"].split(",", 1)[1]

with open("test_images/gradcam_api_result.png", "wb") as file:
    file.write(base64.b64decode(image_data))

print("Grad-CAM API image saved successfully!")
print("Predicted grade:", data["predicted_class"])
