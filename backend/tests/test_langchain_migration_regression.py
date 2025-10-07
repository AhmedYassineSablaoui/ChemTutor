import pytest
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser


class FakeLLM:
    """A minimal Runnable-compatible fake LLM that returns a deterministic string.
    It accepts a prompt value (string or Message-like); for our purposes we only
    need to handle string prompts produced by ChatPromptTemplate.format().
    """

    def invoke(self, prompt, config=None):  # config is ignored
        # Convert prompt to string if it's a structured object
        text = str(prompt)
        # Very simple deterministic behavior to make assertions stable
        # Extract question and a small context fingerprint
        # This is intentionally lightweight and robust to whitespace.
        q_marker = "Question:" if "Question:" in text else "Statement:"
        # Parse the segment after the marker up to end
        try:
            part = text.split(q_marker, 1)[1].strip()
        except Exception:
            part = text.strip()
        question_or_stmt = part.split("\n", 1)[0].strip()
        ctx_len = text.count("\n")  # crude fingerprint
        return f"ANSWER[{q_marker}]({question_or_stmt})|CTX_LINES={ctx_len}"


@pytest.mark.parametrize(
    "context,question",
    [
        ("Ethanol is a volatile, flammable, colorless liquid.", "What are the properties of ethanol?"),
        ("Water is H2O. Oxygen supports combustion.", "How is water formed?"),
    ],
)
def test_runnable_sequence_matches_legacy_llmchain_semantics(context, question):
    """
    Validates that the new RunnableSequence style (prompt | llm | StrOutputParser)
    produces the same final text as the legacy LLMChain would expose via the
    "text" field, assuming both use the same underlying LLM behavior.

    We simulate the legacy LLMChain return shape by wrapping the raw LLM output
    in a dict {"text": ...} and compare it to the RunnableSequence string.
    """
    qa_prompt = ChatPromptTemplate.from_template(
        (
            "You are a helpful chemistry tutor. Use the provided context to answer the question.\n\n"
            "Context:\n{context}\n\n"
            "Question: {question}\n"
            "Answer:"
        )
    )

    fake_llm = FakeLLM()

    # After (RunnableSequence): string output
    after = (qa_prompt | fake_llm | StrOutputParser()).invoke({
        "context": context,
        "question": question,
    })

    # Before (LLMChain semantics): dict with {"text": <same string>}
    # We simulate by invoking the same LLM without the output parser
    before_dict = {"text": (qa_prompt | fake_llm).invoke({
        "context": context,
        "question": question,
    })}

    assert isinstance(after, str)
    assert before_dict["text"] == after


def test_correction_runnable_vs_legacy_equivalence():
    """
    Perform the same equivalence check on the correction-style prompt.
    """
    correction_prompt = ChatPromptTemplate.from_template(
        (
            "You are a chemistry correctness assistant.\n"
            "Statement: {statement}\n"
            "Corrected:"
        )
    )

    fake_llm = FakeLLM()
    statement = "H2 and oxygen makes water"

    after = (correction_prompt | fake_llm | StrOutputParser()).invoke({
        "statement": statement,
    })
    before_dict = {"text": (correction_prompt | fake_llm).invoke({
        "statement": statement,
    })}

    assert isinstance(after, str)
    assert before_dict["text"] == after
