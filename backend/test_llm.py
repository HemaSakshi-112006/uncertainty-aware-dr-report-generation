
from services.llm_report import generate_report

test_prediction = {
    "predicted_class": "Moderate",
    "class_probabilities": {
        "No DR": 0.0,
        "Mild": 0.96,
        "Moderate": 93.62,
        "Severe": 5.04,
        "Proliferative DR": 0.38
    }
}

report = generate_report(test_prediction)

print("\nAI-Generated Screening Report")
print("--------------------------------")
print(report)
