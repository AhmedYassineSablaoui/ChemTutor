from llama_index.core import StorageContext, load_index_from_storage
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.faiss import FaissVectorStore
import os

class RetrievalService:
    def __init__(self, persist_dir: str = "./data/faiss_index"):
        self.persist_dir = persist_dir
        self.index = None
        print(f"🔍 Initializing RetrievalService...")
        print(f"📂 Looking for FAISS index in {self.persist_dir} ...")

        if not os.path.exists(self.persist_dir):
            print(f"❌ FAISS index directory not found at {self.persist_dir}")
            print("⚠️  Using fallback mock retrieval")
            return

        print(f"✅ FAISS directory exists. Files: {os.listdir(self.persist_dir)}")

        # Candidate embedding models
        candidates = [
            (384, "sentence-transformers/all-MiniLM-L6-v2"),
            (768, "sentence-transformers/all-mpnet-base-v2"),
        ]

        last_error: Exception | None = None

        try:
            print("🔄 Loading FAISS vector store...")
            vector_store = FaissVectorStore.from_persist_dir(self.persist_dir)
            print("✅ FAISS vector store loaded")
        except Exception as e:
            print(f"❌ Failed to load FaissVectorStore: {e}")
            print("⚠️  Using fallback mock retrieval")
            return

        # Try different embedding models until one works
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
                print(f"✅ Successfully loaded index with dim={dim} using {model_name}")
                return
            except Exception as e:
                last_error = e
                print(f"↩️  Failed with {model_name}: {e}")

        # If no model worked
        print(f"❌ Unable to load FAISS index from {self.persist_dir}")
        print("⚠️  Using fallback mock retrieval")

    def retrieve(self, query: str, top_k: int = 3):
        if self.index is None:
            print("⚠️  Using mock retrieval (index not available)")
            return self._get_mock_sources(query, top_k)
        
        print(f"🔎 Retrieving top-{top_k} results for query: '{query}'")
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
    
    def rebuild_faiss_index(self):
        """
        Rebuild the FAISS index from scratch.
        This scans your documents directory and re-embeds them.
        """
        print("🔄 Starting FAISS index rebuild...")

        # Step 1: Initialize embeddings (try both if needed)
        from langchain_community.embeddings import HuggingFaceEmbeddings
        from langchain_community.vectorstores import FAISS
        import glob

        try:
            embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        except Exception:
            embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

        # Step 2: Load documents (adapt path as needed)
        docs_path = "./data/documents"
        if not os.path.exists(docs_path):
            print(f"⚠️ No documents found at {docs_path}")
            return

        texts = []
        for file_path in glob.glob(os.path.join(docs_path, "*.txt")):
            with open(file_path, "r", encoding="utf-8") as f:
                texts.append(f.read())

        if not texts:
            print("⚠️ No text files found to index.")
            return

        print(f"📄 Found {len(texts)} documents, embedding and saving FAISS index...")

        # Step 3: Build FAISS index
        vectorstore = FAISS.from_texts(texts, embedding=embeddings)
        save_path = "./data/faiss_index"
        os.makedirs(save_path, exist_ok=True)
        vectorstore.save_local(save_path)

        print("✅ FAISS index rebuilt and saved at", save_path)
