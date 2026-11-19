
def build_zero_shot_prompt(prediction_result):

    predicted_class = prediction_result["predicted_class"]

    probabilities = prediction_result["softmax_probabilities"]

    maximum_probability = prediction_result["maximum_probability"]

    top_two_classes = prediction_result["top_two_classes"]

    top_two_gap = prediction_result["top_two_probability_gap"]

    entropy = prediction_result["normalized_entropy"]

    common_cnn_input = f"""
Predicted DR grade: {predicted_class}

Class-wise softmax probabilities:
{{
{chr(10).join(f'{name}: {prob * 100:.2f}%' for name, prob in probabilities.items())}
}}

Maximum softmax probability: {maximum_probability * 100:.2f}%

Top two predicted classes:
1. {top_two_classes[0]["class"]}: {top_two_classes[0]["probability"] * 100:.2f}%
2. {top_two_classes[1]["class"]}: {top_two_classes[1]["probability"] * 100:.2f}%

Top-two probability gap: {top_two_gap * 100:.2f} percentage points

Normalized entropy: {entropy:.4f}
"""

    prompt = f"""
You are an AI-assisted medical report writing assistant
for an experimental Diabetic Retinopathy screening system.

Your task is to generate a clear, professional and
scientifically cautious screening report using ONLY
the CNN output provided below.

CNN OUTPUT:
{common_cnn_input}

Follow this report structure:

1. Screening Result
- State the predicted DR grade and category.
- Clearly identify it as a CNN-generated prediction.

2. Class-wise Probability Distribution
- Include all five DR categories.
- Convert probabilities into percentages.
- Identify the highest and second-highest predicted classes.
- Ensure the values accurately match the CNN output.

3. Prediction Uncertainty
- Explain the maximum softmax probability.
- Explain the difference between the top two class probabilities.
- Explain normalized entropy as an experimental
  indicator of prediction uncertainty.
- Do not describe these values as calibrated clinical
  confidence or actual disease probabilities.
- Do not make unsupported claims about disease severity.

4. Model Limitations
- State that this is an experimental AI model.
- Explain that it has not been clinically validated.
- Clarify that the LLM only interprets numerical CNN
  outputs and does not examine the retinal image.
- Do not invent retinal findings, patient information,
  symptoms, medical history or clinical observations.

5. Recommendation
- Recommend assessment of the original retinal image
  by a qualified ophthalmologist or eye-care professional.
- Clarify that the prediction is not a confirmed diagnosis.

Additional requirements:
- Use professional, simple medical language.
- Avoid unnecessary repetition.
- Do not recommend medication or treatment.
- Do not claim that the AI can replace a clinician.
- Do not add information that is absent from the CNN output.

Generate a complete, well-organized screening report.
"""

    return prompt

def build_few_shot_prompt(prediction_result):

    predicted_class = prediction_result["predicted_class"]
    probabilities = prediction_result["softmax_probabilities"]
    maximum_probability = prediction_result["maximum_probability"]
    top_two_classes = prediction_result["top_two_classes"]
    top_two_gap = prediction_result["top_two_probability_gap"]
    entropy = prediction_result["normalized_entropy"]

    common_cnn_input = f"""
{{
    "predicted_class": "{predicted_class}",
    "softmax_probabilities": {{
        {chr(10).join(f'"{name}": {prob:.6f}' + ("," if i < len(probabilities)-1 else "") for i, (name, prob) in enumerate(probabilities.items()))}
    }},
    "maximum_probability": {maximum_probability},
    "top_two_classes": [
        {{"class": "{top_two_classes[0]["class"]}", "probability": {top_two_classes[0]["probability"]}}},
        {{"class": "{top_two_classes[1]["class"]}", "probability": {top_two_classes[1]["probability"]}}}
    ],
    "top_two_probability_gap": {top_two_gap},
    "normalized_entropy": {entropy}
}}
"""

    prompt = f"""
You are an AI-assisted medical report writing assistant
for an experimental Diabetic Retinopathy screening system.

Your task is to generate a clear, professional and
scientifically cautious screening report using ONLY
the CNN prediction information provided below.

Follow the style, structure and level of detail demonstrated
in the examples.

EXAMPLE 1:

CNN OUTPUT:
{{
    "predicted_class": "No DR",
    "softmax_probabilities": {{
        "No DR": 0.92,
        "Mild": 0.04,
        "Moderate": 0.02,
        "Severe": 0.01,
        "Proliferative DR": 0.01
    }},
    "maximum_probability": 0.92
}}

SAMPLE REPORT:

Predicted Result: No DR.

The CNN assigns the highest softmax probability to the
No DR category (92%). The remaining probabilities are
distributed across the other four categories.

This is an experimental model prediction and does not
confirm the absence of diabetic retinopathy. Review by
a qualified eye-care professional is recommended.


EXAMPLE 2:

CNN OUTPUT:
{{
    "predicted_class": "Moderate",
    "softmax_probabilities": {{
        "No DR": 0.01,
        "Mild": 0.10,
        "Moderate": 0.70,
        "Severe": 0.12,
        "Proliferative DR": 0.07
    }},
    "maximum_probability": 0.70
}}

SAMPLE REPORT:

Predicted Result: Moderate DR.

The CNN assigns the highest softmax probability to
the Moderate category (70%). Mild and Severe are the
next most probable categories.

This output represents an experimental model prediction,
not a confirmed diagnosis. Assessment by a qualified
eye-care professional is recommended.


NOW GENERATE A REPORT FOR THE FOLLOWING CNN OUTPUT:

CNN OUTPUT:
{common_cnn_input}


REPORT STRUCTURE AND INSTRUCTIONS:

1. Screening Result
- State the predicted DR grade and category.
- Identify it as a CNN-generated prediction.

2. Class-wise Probability Distribution
- Include all five DR categories.
- Convert probabilities into percentages.
- Identify the highest and second-highest predicted classes.
- Ensure all values accurately match the CNN output.

3. Prediction Uncertainty
- Explain the maximum softmax probability.
- Explain the difference between the top two class probabilities
  in percentage points.
- Explain normalized entropy as an experimental indicator
  describing the distribution of predicted probabilities.
- Do not interpret entropy as calibrated confidence or
  clinical certainty.
- Do not make unsupported claims about disease severity.

4. Model Limitations
- State that this is an experimental research-stage model
  that has not undergone clinical validation.
- Clarify that the CNN processed the retinal image to
  generate the prediction.
- Clarify that the language model received only the
  numerical CNN output and did not independently examine
  the retinal image.
- Do not invent retinal findings, patient details,
  symptoms or medical history.

5. Recommendation
- Recommend review of the original retinal image and
  clinical information by a qualified ophthalmologist
  or retinal specialist.
- Clarify that this prediction is not a confirmed diagnosis.

ADDITIONAL REQUIREMENTS:
- Follow the professional style demonstrated in the examples.
- Use simple, clear medical language.
- Avoid unnecessary repetition.
- Do not recommend medication or treatment.
- Do not claim that AI can replace a clinician.
- Do not add information that is absent from the CNN output.

Generate a complete, well-organized screening report.
"""

    return prompt

def build_uncertainty_aware_prompt(prediction_result):

    predicted_class = prediction_result["predicted_class"]
    probabilities = prediction_result["softmax_probabilities"]
    maximum_probability = prediction_result["maximum_probability"]
    top_two_classes = prediction_result["top_two_classes"]
    top_two_gap = prediction_result["top_two_probability_gap"]
    entropy = prediction_result["normalized_entropy"]

    common_cnn_input = f"""
Predicted DR grade: {predicted_class}

Class-wise softmax probabilities:
{{
{chr(10).join(f'{name}: {prob * 100:.2f}%' for name, prob in probabilities.items())}
}}

Maximum softmax probability: {maximum_probability * 100:.2f}%

Top two predicted classes:
1. {top_two_classes[0]["class"]}: {top_two_classes[0]["probability"] * 100:.2f}%
2. {top_two_classes[1]["class"]}: {top_two_classes[1]["probability"] * 100:.2f}%

Top-two probability gap: {top_two_gap * 100:.2f} percentage points

Normalized entropy: {entropy:.4f}
"""

    prompt = f"""
You are an AI-assisted medical report writing assistant
for an experimental Diabetic Retinopathy screening system.

Your task is to generate a professional, scientifically
cautious screening report using ONLY the numerical output
provided by the CNN.

CNN OUTPUT:
{common_cnn_input}


CORE APPROACH: UNCERTAINTY-AWARE ADAPTIVE REPORTING

Adapt the explanation of the CNN prediction by considering
the following three indicators together.

1. MAXIMUM SOFTMAX PROBABILITY

- Identify the highest softmax probability and its class.
- Explain that it represents the largest score assigned
  by the CNN among the five classes.
- Do not describe it as calibrated clinical confidence
  or a confirmed probability of disease.

2. TOP-TWO PROBABILITY GAP

- Identify the two highest probability classes.
- Explain the numerical difference between their scores.
- Express the difference in percentage points.
- Explain whether the leading class is numerically
  separated from or relatively close to the second class.
- Do not interpret this gap as clinical certainty.

3. NORMALIZED ENTROPY

- Use the supplied normalized entropy value.
- Explain that entropy describes how the CNN's
  probability distribution is spread across the classes.
- A more concentrated distribution has lower entropy,
  while a more evenly distributed probability pattern
  has higher entropy.
- Do not assign labels such as low, moderate or high
  uncertainty using unvalidated thresholds.
- Do not interpret entropy as clinical certainty.

4. COMBINED ADAPTIVE INTERPRETATION

- Consider maximum softmax probability, top-two gap
  and normalized entropy together.
- Explain which class receives the largest probability.
- Describe the separation between the two leading classes.
- Explain how the remaining probabilities contribute
  to the overall distribution.
- Avoid contradictory or exaggerated interpretations.
- Do not invent additional uncertainty measurements.


REPORT STRUCTURE:

1. SCREENING RESULT

- State the predicted DR grade and category.
- Clearly identify it as a CNN-generated prediction.
- Do not present it as a confirmed diagnosis.

2. CLASS-WISE PROBABILITY DISTRIBUTION

- Include all five DR categories.
- Convert probabilities into percentages.
- Round percentages to two decimal places.
- Identify the highest and second-highest classes.
- Preserve the numerical values supplied by the CNN.

3. ADAPTIVE UNCERTAINTY ANALYSIS

Include four subsections:

a. Maximum Softmax Probability
b. Top-Two Probability Gap
c. Normalized Entropy
d. Combined Interpretation

Explain all three indicators accurately and describe
their relationship without making clinical conclusions.

4. MODEL LIMITATIONS

- State that the CNN is an experimental research-stage
  model that has not undergone formal clinical validation.
- Clarify that the CNN processed the retinal image.
- Clarify that the language model received only the
  numerical CNN output and did not independently
  examine the retinal image.
- Explain that the generated report does not include
  direct visual observations from the language model.
- Do not invent patient information, symptoms,
  medical history or retinal findings.

5. RECOMMENDATION

- Recommend review of the original retinal image and
  relevant clinical information by a qualified
  ophthalmologist or retinal specialist.
- Clearly state that the CNN prediction is not a
  confirmed diagnosis.
- Do not recommend medication or treatment.


STRICT ACCURACY AND SAFETY REQUIREMENTS:

- Use only the supplied CNN output.
- Do not change, omit or fabricate probability values.
- Do not invent retinal lesions or clinical observations.
- Do not describe softmax scores as calibrated
  clinical probabilities.
- Do not apply unvalidated clinical thresholds.
- Do not claim that AI can replace an ophthalmologist.
- Use clear, professional and scientifically cautious
  language.
- Avoid unnecessary repetition.


Generate a complete, well-organized screening report
with an adaptive interpretation of the CNN's numerical
prediction and uncertainty indicators.
"""

    return prompt

def build_chain_of_verification_prompt(prediction_result):

    predicted_class = prediction_result["predicted_class"]
    probabilities = prediction_result["softmax_probabilities"]
    maximum_probability = prediction_result["maximum_probability"]
    top_two_classes = prediction_result["top_two_classes"]
    top_two_gap = prediction_result["top_two_probability_gap"]
    entropy = prediction_result["normalized_entropy"]

    common_cnn_input = f"""
Predicted DR grade: {predicted_class}

Class-wise softmax probabilities:
{{
{chr(10).join(f'{name}: {prob * 100:.2f}%' for name, prob in probabilities.items())}
}}

Maximum softmax probability: {maximum_probability * 100:.2f}%

Top two predicted classes:
1. {top_two_classes[0]["class"]}: {top_two_classes[0]["probability"] * 100:.2f}%
2. {top_two_classes[1]["class"]}: {top_two_classes[1]["probability"] * 100:.2f}%

Top-two probability gap: {top_two_gap * 100:.2f} percentage points

Normalized entropy: {entropy:.4f}
"""

    prompt = f"""
You are an AI-assisted medical report writing assistant
for an experimental Diabetic Retinopathy screening system.

Your task is to generate an accurate and scientifically
cautious screening report using ONLY the numerical output
provided by the CNN.

ORIGINAL CNN OUTPUT:
{common_cnn_input}


CHAIN-OF-VERIFICATION PROCESS

Follow these four stages carefully.

STAGE 1: INITIAL REPORT GENERATION

Generate an initial screening report using the CNN output.

Include:
- Predicted DR grade and category.
- All five class-wise probabilities.
- Maximum softmax probability.
- Top-two predicted classes and their probability gap.
- Normalized entropy.
- Model limitations and recommendation.

STAGE 2: CREATE VERIFICATION QUESTIONS

Identify factual claims in your initial report that need
verification.

Create verification questions covering:

1. Is the predicted DR grade consistent with the CNN output?
2. Are all five class probabilities copied correctly?
3. Are the highest and second-highest classes correct?
4. Is the maximum softmax probability accurate?
5. Is the top-two probability gap calculated correctly?
6. Is the normalized entropy copied correctly?
7. Does the report contain any unsupported clinical claims?
8. Does the report incorrectly describe the LLM as having
   examined the retinal image?

STAGE 3: VERIFY THE CLAIMS

Answer each verification question by comparing the
initial report directly against the ORIGINAL CNN OUTPUT.

Rules:
- Treat the original CNN output as the source of truth.
- Correct any incorrect numerical values.
- Do not invent missing information.
- Remove claims that cannot be supported by the CNN output.
- Do not interpret softmax scores as calibrated clinical
  probabilities or confirmed disease likelihood.
- Do not assign clinical uncertainty categories using
  unvalidated thresholds.
- Do not invent retinal lesions, symptoms, patient history,
  or other clinical observations.

STAGE 4: GENERATE THE VERIFIED FINAL REPORT

Use the verification results to produce a corrected report.

The final report must contain:

1. SCREENING RESULT
   - Predicted DR category and grade.
   - Clearly identify it as a CNN-generated prediction,
     not a confirmed diagnosis.

2. CLASS-WISE PROBABILITY DISTRIBUTION
   - Include all five classes.
   - Express probabilities as percentages rounded to
     two decimal places.
   - Preserve the CNN values accurately.

3. PREDICTION AND UNCERTAINTY INFORMATION
   - Maximum softmax probability.
   - Top-two predicted classes.
   - Top-two probability gap in percentage points.
   - Normalized entropy.
   - Explain these indicators without claiming clinical
     certainty or applying unvalidated thresholds.

4. MODEL LIMITATIONS
   - The CNN processed the retinal image.
   - The language model received only numerical CNN output
     and did not independently examine the image.
   - The system is experimental and has not undergone
     formal clinical validation.
   - The report does not establish a diagnosis.

5. RECOMMENDATION
   - Recommend review of the original retinal image and
     relevant clinical information by a qualified
     ophthalmologist or retinal specialist.
   - Do not recommend medication or treatment.

STRICT REQUIREMENTS:

- The original CNN output is the only source of prediction
  data.
- Do not modify or fabricate numerical values.
- Do not invent clinical findings or patient information.
- Do not claim that the LLM independently analyzed the
  retinal image.
- Do not claim that verification proves the CNN prediction
  is medically correct.
- Use professional, clear and cautious language.

OUTPUT FORMAT:

A. Initial Report
B. Verification Questions and Answers
C. Corrections Made
D. Final Verified Screening Report

Show all four sections so that the verification process
can be examined as part of this research experiment.
"""

    return prompt

def build_evidence_grounded_prompt(prediction_result):

    predicted_class = prediction_result["predicted_class"]
    probabilities = prediction_result["softmax_probabilities"]
    maximum_probability = prediction_result["maximum_probability"]
    top_two_classes = prediction_result["top_two_classes"]
    top_two_gap = prediction_result["top_two_probability_gap"]
    entropy = prediction_result["normalized_entropy"]

    common_cnn_input = f"""
Predicted DR grade: {predicted_class}

Class-wise softmax probabilities:
{{
{chr(10).join(f'{name}: {prob * 100:.2f}%' for name, prob in probabilities.items())}
}}

Maximum softmax probability: {maximum_probability * 100:.2f}%

Top two predicted classes:
1. {top_two_classes[0]["class"]}: {top_two_classes[0]["probability"] * 100:.2f}%
2. {top_two_classes[1]["class"]}: {top_two_classes[1]["probability"] * 100:.2f}%

Top-two probability gap: {top_two_gap * 100:.2f} percentage points

Normalized entropy: {entropy:.4f}
"""

    prompt = f"""
You are an AI-assisted medical report writing assistant
for an experimental Diabetic Retinopathy screening system.

Your task is to generate a professional screening report
using a STRICT EVIDENCE-GROUNDED, CLOSED-WORLD approach.

ORIGINAL CNN OUTPUT:
{common_cnn_input}


CORE PRINCIPLE: CLOSED-WORLD INFORMATION

The supplied CNN output is the ONLY source of information
about this individual screening prediction.

You must follow these rules:

1. Use only information explicitly available in the
   supplied CNN output.

2. Do not use assumptions, external medical knowledge,
   or invented details to fill missing patient information.

3. Do not invent:
   - Patient name, age or gender.
   - Symptoms or medical history.
   - Retinal lesions or image observations.
   - Blood sugar levels or other test results.
   - Previous diagnoses or treatments.

4. The CNN processed the retinal image. You received only
   its numerical output and did not independently examine
   the retinal image.

5. If a requested detail is not available in the CNN output,
   clearly state:
   "Not available in the supplied CNN output."

6. Distinguish between a model prediction and a confirmed
   medical diagnosis.


REPORT REQUIREMENTS

1. SCREENING RESULT

- State the predicted DR grade and category.
- Use the exact predicted class from the CNN output.
- Clearly identify it as a CNN-generated prediction.
- Do not call it a confirmed diagnosis.

2. CLASS-WISE PROBABILITY DISTRIBUTION

- Include all five DR categories:
  No DR, Mild, Moderate, Severe and Proliferative DR.
- Convert the supplied probabilities into percentages.
- Round percentages to two decimal places.
- Preserve the original values accurately.

3. MODEL OUTPUT INTERPRETATION

- State the maximum softmax probability.
- Identify the top two predicted classes.
- State the top-two probability gap.
- State normalized entropy.
- Explain that these are numerical characteristics
  of the CNN output, not calibrated clinical probabilities.
- Do not apply unvalidated uncertainty thresholds.

4. AVAILABLE AND UNAVAILABLE INFORMATION

Clearly distinguish:

Available:
- CNN-predicted DR category and grade.
- Class-wise softmax scores.
- Maximum softmax probability.
- Top-two probability gap.
- Normalized entropy.

Unavailable:
- Patient identity and demographics.
- Symptoms and medical history.
- Direct clinical observations.
- Retinal lesion descriptions.
- Confirmatory examination results.

Do not infer any unavailable information.

5. MODEL LIMITATIONS

- This is an experimental research-stage system.
- It has not undergone formal clinical validation.
- The language model received only numerical CNN output.
- The language model did not independently examine
  the retinal image.
- This report is not a confirmed diagnosis.

6. RECOMMENDATION

- Recommend that a qualified ophthalmologist or retinal
  specialist review the original retinal image and
  relevant clinical information.
- Do not recommend medication or treatment.


FINAL ACCURACY CHECK

Before producing the report, check that:

- Every prediction-related statement is supported by
  the original CNN output.
- All five probabilities are accurately represented.
- No patient information has been invented.
- No retinal findings have been fabricated.
- No unsupported clinical conclusions are included.
- Missing information is clearly identified.
- The CNN prediction is not presented as a diagnosis.

OUTPUT FORMAT

A. Screening Result
B. Class-Wise Probability Distribution
C. Model Output Interpretation
D. Available and Unavailable Information
E. Model Limitations
F. Recommendation

Generate a complete, professional and scientifically
cautious screening report.
"""

    return prompt

def build_self_consistency_prompt(prediction_result):

    predicted_class = prediction_result["predicted_class"]
    probabilities = prediction_result["softmax_probabilities"]
    maximum_probability = prediction_result["maximum_probability"]
    top_two_classes = prediction_result["top_two_classes"]
    top_two_gap = prediction_result["top_two_probability_gap"]
    entropy = prediction_result["normalized_entropy"]

    common_cnn_input = f"""
Predicted DR grade: {predicted_class}

Class-wise softmax probabilities:
{{
{chr(10).join(f'{name}: {prob * 100:.2f}%' for name, prob in probabilities.items())}
}}

Maximum softmax probability: {maximum_probability * 100:.2f}%

Top two predicted classes:
1. {top_two_classes[0]["class"]}: {top_two_classes[0]["probability"] * 100:.2f}%
2. {top_two_classes[1]["class"]}: {top_two_classes[1]["probability"] * 100:.2f}%

Top-two probability gap: {top_two_gap * 100:.2f} percentage points

Normalized entropy: {entropy:.4f}
"""

    prompt = f"""
You are an AI-assisted medical report writing assistant
for an experimental Diabetic Retinopathy screening system.

Your task is to examine the consistency of reports generated
from the same CNN prediction.

ORIGINAL CNN OUTPUT:
{common_cnn_input}


SELF-CONSISTENCY EXPERIMENT

Generate THREE independent screening reports using the
same original CNN output.

Treat each report as an independent generation.
Do not use the previous report to determine the next one.

Use the same factual information and safety requirements
for all three reports.


REPORT GENERATION REQUIREMENTS

For EACH of the three reports, include:

1. SCREENING RESULT
   - Predicted DR grade and category.
   - Clearly state that this is a CNN prediction,
     not a confirmed diagnosis.

2. CLASS-WISE PROBABILITY DISTRIBUTION
   - Include all five DR categories.
   - Convert probabilities into percentages.
   - Round percentages to two decimal places.
   - Preserve the original CNN values.

3. PREDICTION METRICS
   - Maximum softmax probability.
   - Top two predicted classes.
   - Top-two probability gap in percentage points.
   - Normalized entropy.
   - Explain these as numerical model-output indicators,
     not calibrated clinical probabilities.

4. MODEL LIMITATIONS
   - The CNN processed the retinal image.
   - The language model received only numerical CNN output.
   - The language model did not independently examine
     the retinal image.
   - The system is experimental and has not undergone
     formal clinical validation.

5. RECOMMENDATION
   - Recommend review of the original retinal image and
     relevant clinical information by a qualified
     ophthalmologist or retinal specialist.
   - Do not recommend medication or treatment.


CONSISTENCY ANALYSIS

After generating all three reports, compare them.

Evaluate:

1. Whether all three identify the same predicted DR grade.
2. Whether all three identify the same predicted category.
3. Whether all five probabilities are reproduced accurately.
4. Whether maximum softmax probability is consistent.
5. Whether the top-two classes and probability gap match.
6. Whether normalized entropy is consistent.
7. Whether all reports follow the same medical safety rules.
8. Whether any report contains unsupported clinical claims.

Identify any differences in wording or factual content.

If a report contains an error, identify it and state the
correct value using the ORIGINAL CNN OUTPUT.

Do not assume that agreement between reports proves that
the CNN prediction is medically correct.


FINAL OUTPUT FORMAT

A. Independent Report 1
B. Independent Report 2
C. Independent Report 3
D. Consistency Comparison Table
E. Errors or Differences Identified
F. Overall Consistency Assessment

STRICT RULES

- Use only the original CNN output as prediction evidence.
- Do not invent clinical findings or patient information.
- Do not modify numerical values.
- Do not claim that the LLM examined the retinal image.
- Do not interpret softmax values as calibrated clinical
  probabilities.
- Do not present the prediction as a confirmed diagnosis.
- Keep the reports independently generated in content.

Generate all three reports and the comparison.
"""

    return prompt
