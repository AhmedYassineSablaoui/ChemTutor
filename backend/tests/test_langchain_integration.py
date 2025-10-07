from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
from langchain_huggingface import HuggingFacePipeline  # new import
import pytest

def test_langchain_integration():
    model_path = "./models/correction_model"
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_path)

    # Increase generation length and make output clearer
    hf_pipeline = pipeline(
        "text2text-generation",
        model=model,
        tokenizer=tokenizer,
        max_new_tokens=128,
        temperature=0.7,
        repetition_penalty=1.2,
        top_p=0.95,
        num_beams=4
    )

    llm = HuggingFacePipeline(pipeline=hf_pipeline)

    # Use input pattern similar to training dataset
    prompt = (
        "Incorrect statement: Water boils at 50°C.\n"
        "Task: Provide the corrected statement and a short explanation."
    )

    response = llm.invoke(prompt)  # use invoke() instead of __call__

    print("\n🔍 LangChain Integration Test:")
    print(response)

    assert isinstance(response, str)
    assert len(response.strip()) > 0
