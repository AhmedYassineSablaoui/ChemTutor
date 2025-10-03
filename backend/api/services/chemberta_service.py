from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import os

class ChemBERTaService:
    def __init__(self):
        model_path = "./models/chemberta/fine_tuned_t5_chem_small/fine_tuned_t5_chem_small"
        print("🔍 Initializing ChemBERTaService...")
        print("🔍 Checking model path:", model_path)

        # Check if model files exist properly
        model_file = os.path.join(model_path, "model.safetensors")
        if not os.path.exists(model_file):
            print(f"❌ Model file not found at {model_file}")
            print("⚠️  Using fallback mock responses for QA")
            self.model = None
            self.tokenizer = None
            self.pipeline = None
            return
        else:
            print(f"✅ Found model file at {model_file}")

        try:
            print("🔄 Loading tokenizer and model...")
            self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(model_path)

            # ✅ Inference optimizations
            self.model = self.model.eval()   # inference mode
            self.model.to("cpu")             # ensure CPU

            # Use "text2text-generation" pipeline for T5-like models
            self.pipeline = pipeline(
                "text2text-generation",
                model=self.model,
                tokenizer=self.tokenizer,
                device=-1  # -1 = CPU
            )

            print(f"✅ ChemBERTa model successfully loaded from {model_path}")

        except Exception as e:
            print(f"❌ Error loading model: {e}")
            print("⚠️  Using fallback mock responses for QA")
            self.model = None
            self.tokenizer = None
            self.pipeline = None

    def generate_answer(self, question: str) -> str:
        if self.pipeline is None:
            print("⚠️  Using mock response (model not available)")
            return self._get_mock_response(question)

        prompt = f"Question: {question}\nAnswer:"
        with torch.no_grad():
            result = self.pipeline(
                prompt,
                max_length=200,
                num_return_sequences=1,
                do_sample=False  # deterministic output faster on CPU
            )
        return result[0]['generated_text'].strip()
    
    def _get_mock_response(self, question: str) -> str:
        """Provide mock responses when the model is not available"""
        question_lower = question.lower()
        
        if 'ethanol' in question_lower:
            return """Ethanol (C₂H₅OH) is an organic compound with the following key properties:

Physical Properties:
- Molecular weight: 46.07 g/mol
- Boiling point: 78.37°C (173.07°F)
- Melting point: -114.1°C (-173.4°F)
- Density: 0.789 g/cm³ at 20°C
- Solubility: Miscible with water and many organic solvents
- Appearance: Colorless liquid with a characteristic odor

Chemical Properties:
- Flammable liquid
- Acts as both a weak acid and weak base
- Can undergo oxidation to form acetaldehyde and acetic acid
- Forms hydrogen bonds with water molecules
- Used as a solvent, fuel, and in alcoholic beverages

Safety: Ethanol is flammable and should be handled with care. It can cause intoxication when consumed."""
        
        elif 'properties' in question_lower:
            return "Chemical properties depend on the specific compound you're asking about. Could you please specify which compound you'd like to know about?"
        
        else:
            return f"Thank you for your question: '{question}'. I'm currently running in demo mode with limited responses. For full functionality, the ChemBERTa model needs to be properly installed."
