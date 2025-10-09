from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_huggingface import HuggingFacePipeline

from .chemberta_service import ChemBERTaService
from .correction_service import CorrectionService
from .retrieval_service import RetrievalService
from transformers import pipeline as hf_pipeline


class Orchestrator:
    def __init__(self):
        # Initialize Retrieval + Generator for Q&A
        self.retrieval_service = RetrievalService()

        chemberta_service = ChemBERTaService()
        if chemberta_service.pipeline is not None:
            self.llm = HuggingFacePipeline(pipeline=chemberta_service.pipeline)
        else:
            self.llm = None

        # Q&A prompt chain (LangChain)
        self.qa_chain = None
        if self.llm is not None:
            qa_prompt = ChatPromptTemplate.from_template(
                """
                You are a helpful chemistry tutor. Use the provided context to answer the question concisely and accurately.
                If the context is insufficient, say you don't have enough information and suggest what would help.

                Context:
                {context}

                Question: {question}
                Answer:
                """.strip()
            )
            # RunnableSequence style: prompt | llm | parser (compatible with LC >= 0.3)
            self.qa_chain = qa_prompt | self.llm | StrOutputParser()

        # Initialize correction service and chain
        self.correction_service = CorrectionService()
        self.correction_llm = None
        if getattr(self.correction_service, "model", None) is not None and getattr(self.correction_service, "tokenizer", None) is not None:
            try:
                corr_pipe = hf_pipeline(
                    "text2text-generation",
                    model=self.correction_service.model,
                    tokenizer=self.correction_service.tokenizer,
                    device=-1,
                )
                self.correction_llm = HuggingFacePipeline(pipeline=corr_pipe)
            except Exception:
                self.correction_llm = None

        self.correction_chain = None
        if self.correction_llm is not None:
            correction_prompt = ChatPromptTemplate.from_template(
                """
                You are a chemistry correctness assistant. Correct factual or chemical notation errors in the following statement.
                - Preserve the original meaning where possible.
                - Use proper chemical formulas and nomenclature.
                - Return only the corrected statement without extra commentary.

                Statement: {statement}
                Corrected:
                """.strip()
            )
            # RunnableSequence style
            self.correction_chain = correction_prompt | self.correction_llm | StrOutputParser()

    def run_workflow(self, feature: str, input_data: str):
        """
        Run the requested feature (e.g., correction, classification, etc.)
        """
        if feature == "qa":
            print("🟡 Q&A input data:", input_data)
            # Retrieve context and run LangChain Q&A
            context_list = self.retrieval_service.retrieve(input_data)
            context = "\n".join(context_list)
            print("🟡 Q&A retrieved context:", context_list)
            if self.qa_chain is None:
                 print("🔴 Q&A: LLM pipeline not available!")
                 return {
                    "feature": "qa",
                    "input": input_data,
                    "answer": "LLM not available. Please ensure the ChemBERTa model is installed.",
                    "sources": context_list,
                }
            # RunnableSequence returns a string
            answer = self.qa_chain.invoke({"context": context, "question": input_data})
            print("🟢 Q&A model answer:", answer)
            return {
                "feature": "qa",
                "input": input_data,
                "answer": answer,
                "sources": context_list,
            }

        elif feature == "correction":
            # Prefer LangChain correction chain if available, else fallback to service.correct
            if self.correction_chain is not None:
                    print("🟡 Invoking correction_chain with input:", input_data)
                    corrected = self.correction_chain.invoke({"statement": input_data})
                    print("🟢 Correction chain output:", corrected)
            else:
                    print("🟡 Falling back to correction_service for input:", input_data)
                    corrected = self.correction_service.correct(input_data)
                    print("🟢 Correction service output:", corrected)
            return {
                "feature": "correction",
                "input": input_data,
                "corrected": corrected,
            }

        else:
            return {
                "error": f"Unknown feature '{feature}'. Available: qa, correction"
            }
