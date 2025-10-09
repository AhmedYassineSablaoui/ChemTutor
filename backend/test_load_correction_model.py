from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

MODEL_PATH = "./models/correction_model"

try:
    print("🔍 Loading tokenizer and model...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH)
    print("✅ Model and tokenizer loaded successfully.")

    # Test the pipeline with a sample input
    input_text = "Correct: Water formula is H2O"
    inputs = tokenizer(input_text, return_tensors="pt")
    output = model.generate(**inputs, max_length=128)
    decoded = tokenizer.decode(output[0], skip_special_tokens=True)
    print("📤 Model output:", decoded)
except Exception as e:
    print("❌ Model loading failed:", e)