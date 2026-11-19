
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

MODEL_NAME = "openai/gpt-oss-120b"


def generate_report(prediction_result):

    predicted_class = prediction_result["predicted_class"]
    probabilities = prediction_result["class_probabilities"]

    prompt = f"""
You are an AI assistant that explains diabetic retinopathy
screening model results in clear and simple language.

The CNN model produced the following results:

Predicted DR grade: {predicted_class}

Class probabilities:
{probabilities}

Instructions:
1. Explain the predicted DR grade.
2. Summarize the class probability distribution.
3. Explain that these percentages are model output probabilities,
   not calibrated clinical confidence.
4. Do not claim that you examined the retinal image.
5. Do not invent retinal findings, lesions, symptoms, or patient history.
6. Do not provide a confirmed diagnosis or treatment advice.
7. Clearly state that this is an experimental AI screening result
   and requires review by a qualified ophthalmologist.
8. Use clear headings and simple language.

Generate a concise screening report based only on the information provided.
"""

    response = groq_client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content
