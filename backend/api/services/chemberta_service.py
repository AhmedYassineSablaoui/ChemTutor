from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import torch

class ChemBERTaService:
    def __init__(self):
        model_path = "./models/chemberta/fine_tuned_t5_chem_small/fine_tuned_t5_chem_small"

        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_path)

        # ✅ Inference optimizations
        self.model = self.model.eval()              # inference mode
        self.model.to("cpu")                        # ensure CPU
        self.model = torch.compile(self.model)      # PyTorch 2.x optimization (if available)

        # Use "text2text-generation" pipeline for T5
        self.pipeline = pipeline(
            "text2text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            device=-1  # -1 = CPU
        )

    def generate_answer(self, question: str) -> str:
        prompt = f"Question: {question}\nAnswer:"
        # ✅ Disable gradient tracking to save CPU cycles
        with torch.no_grad():
            result = self.pipeline(
                prompt,
                max_length=200,
                num_return_sequences=1,
                do_sample=False  # deterministic output faster on CPU
            )
        return result[0]['generated_text'].strip()
