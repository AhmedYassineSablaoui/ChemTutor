from llama_index.core import StorageContext, load_index_from_storage
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.faiss import FaissVectorStore
import json
import os


class RetrievalService:
    def __init__(self, persist_dir: str = "./data/faiss_index"):
        self.persist_dir = persist_dir
        self.index = None
        print(f"📂 Loading FAISS index from {self.persist_dir} ...")

        # Check if the persist directory exists
        if not os.path.exists(self.persist_dir):
            print(f"Warning: FAISS index directory not found at {self.persist_dir}")
            print("Using fallback mock retrieval")
            return

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
            print(f"Failed to load FaissVectorStore from {self.persist_dir}: {e}")
            print("Using fallback mock retrieval")
            return

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

        # If none of the candidates worked, use fallback
        print(f"Unable to load FAISS index from {self.persist_dir} with known embedding models")
        print("Using fallback mock retrieval")

    def retrieve(self, query: str, top_k: int = 3):
        if self.index is None:
            return self._get_mock_sources(query, top_k)
        
        retriever = self.index.as_retriever(similarity_top_k=top_k)
        results = retriever.retrieve(query)
        return [n.node.get_content() for n in results]
    
    def _get_mock_sources(self, query: str, top_k: int = 3):
        """Provide mock sources when the retrieval system is not available"""
        query_lower = query.lower()
        
        mock_sources = []
        
        if 'ethanol' in query_lower:
            mock_sources = [
                "Ethanol is a simple alcohol with the chemical formula C₂H₅OH. It is a volatile, flammable, colorless liquid with a slight characteristic odor.",
                "Ethanol has a boiling point of 78.37°C and a melting point of -114.1°C. It is miscible with water and many organic solvents.",
                "Ethanol is produced by fermentation of sugars by yeasts or by petrochemical processes such as ethylene hydration."
            ]
        elif 'properties' in query_lower:
            mock_sources = [
                "Chemical properties describe how a substance behaves in chemical reactions and include reactivity, stability, and bonding characteristics.",
                "Physical properties are characteristics that can be observed without changing the chemical composition of a substance.",
                "Properties of compounds depend on their molecular structure, intermolecular forces, and environmental conditions."
            ]
        else:
            mock_sources = [
                "Chemistry is the study of matter, its properties, composition, structure, and the changes it undergoes.",
                "Chemical compounds are formed when atoms bond together through various types of chemical bonds.",
                "Understanding chemical properties helps predict how substances will behave in different conditions."
            ]
        
        return mock_sources[:top_k]
