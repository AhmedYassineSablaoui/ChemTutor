
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

class CorrectionService:
    def __init__(self, model_path="./models/correction_model"):
        self.model = None
        self.tokenizer = None
        
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(model_path)
        except Exception as e:
            print(f"Warning: Could not load correction model from {model_path}: {e}")
            print("Correction service will use fallback mode (return original statement)")
            self.model = None
            self.tokenizer = None

    def correct(self, statement: str):
        # If model is not available, return the original statement
        if self.model is None or self.tokenizer is None:
            return statement
            
        inputs = self.tokenizer(f"Correct: {statement}", return_tensors="pt")
        outputs = self.model.generate(**inputs, max_length=128, num_beams=4)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
