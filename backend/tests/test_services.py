import requests
import os

# 1. Test backend API health endpoint
def test_api_health():
    try:
        resp = requests.get("http://localhost:8000/api/health/")
        print("✅ API Health:", resp.status_code, resp.text)
    except Exception as e:
        print("❌ API health check failed:", e)


# 2. Test T5-small model
def test_chemb_erta():
    try:
        from api.services.chemberta_service import ChemBERTaService
        s = ChemBERTaService()
        answer = s.generate_answer("What are the properties of ethanol?")
        print("✅ T5-small Model Response (first 300 chars):")
        print(answer[:300])
    except Exception as e:
        print("❌ T5-small model test failed:", e)


# 3. Test FAISS index
def test_faiss():
    try:
        from llama_index.core import StorageContext, load_index_from_storage
        storage_dir = os.path.join("data", "faiss_index")
        storage_context = StorageContext.from_defaults(persist_dir=storage_dir)
        index = load_index_from_storage(storage_context)
        query_engine = index.as_query_engine()
        response = query_engine.query("What is ethanol?")
        print("✅ FAISS Index Response:")
        print(response)
    except Exception as e:
        print("❌ FAISS index test failed:", e)


if __name__ == "__main__":
    print("🔍 Running backend service tests...\n")
    test_api_health()
    print("\n---\n")
    test_chemb_erta()
    print("\n---\n")
    test_faiss()
