from llama_index.core import StorageContext, load_index_from_storage
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.faiss import FaissVectorStore
import json
import os


class RetrievalService:
    def __init__(self, persist_dir: str = "./data/faiss_index"):
        self.persist_dir = persist_dir
        print(f"📂 Loading FAISS index from {self.persist_dir} ...")

        # Try a set of known embedding dims/models, pick the first that loads
        candidates = [
            (384, "sentence-transformers/all-MiniLM-L6-v2"),
            (768, "sentence-transformers/all-mpnet-base-v2"),
        ]

        last_error: Exception | None = None
        # Preload FAISS vector store from persisted dir so we don't fall back to SimpleVectorStore
        try:
            vector_store = FaissVectorStore.from_persist_dir(self.persist_dir)
        except Exception as e:
            raise RuntimeError(
                f"Failed to load FaissVectorStore from {self.persist_dir}: {e}"
            ) from e

        for dim, model_name in candidates:
            try:
                print(f"🧠 Trying embedding model {model_name} (dim={dim}) ...")
                embed_model = HuggingFaceEmbedding(model_name=model_name)
                storage_context = StorageContext.from_defaults(
                    persist_dir=self.persist_dir,
                    vector_store=vector_store,
                )
                self.index = load_index_from_storage(
                    storage_context,
                    embed_model=embed_model,
                )
                print(f"✅ Loaded index with embedding dim={dim} using {model_name}")
                return
            except Exception as e:
                last_error = e
                print(f"↩️  Failed with {model_name}: {e}")

        # If none of the candidates worked, raise the last error for visibility
        raise RuntimeError(
            f"Unable to load FAISS index from {self.persist_dir} with known embedding models"
        ) from last_error

    def retrieve(self, query: str, top_k: int = 3):
        retriever = self.index.as_retriever(similarity_top_k=top_k)
        results = retriever.retrieve(query)
        return [n.node.get_content() for n in results]
