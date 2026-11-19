
import os
from groq import Groq
from dotenv import load_dotenv

from services.prompt_templates import (
    build_zero_shot_prompt,
    build_few_shot_prompt,
    build_uncertainty_aware_prompt,
    build_chain_of_verification_prompt,
    build_evidence_grounded_prompt,
    build_self_consistency_prompt
)

load_dotenv()

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

MODEL_NAME = "openai/gpt-oss-120b"


PROMPT_BUILDERS = {
    "zero_shot": build_zero_shot_prompt,
    "few_shot": build_few_shot_prompt,
    "uncertainty_aware": build_uncertainty_aware_prompt,
    "chain_of_verification": build_chain_of_verification_prompt,
    "evidence_grounded": build_evidence_grounded_prompt,
    "self_consistency": build_self_consistency_prompt
}


def generate_report(prediction_result, technique="zero_shot"):

    if technique not in PROMPT_BUILDERS:
        raise ValueError("Invalid prompt technique selected")

    prompt = PROMPT_BUILDERS[technique](prediction_result)

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
