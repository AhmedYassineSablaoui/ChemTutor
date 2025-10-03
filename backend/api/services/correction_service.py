
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

class CorrectionService:
    def __init__(self, model_path="./models/correction_model"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_path)

    def correct(self, statement: str):
        inputs = self.tokenizer(f"Correct: {statement}", return_tensors="pt")
        outputs = self.model.generate(**inputs, max_length=128, num_beams=4)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
