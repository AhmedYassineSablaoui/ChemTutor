from api.services.orchestrator import Orchestrator

def test_qa_basic():
    orc = Orchestrator()
    res = orc.run_workflow("qa", "What are the properties of ethanol?")
    assert res["feature"] == "qa"
    assert "sources" in res
    assert "answer" in res

def test_correction_basic():
    orc = Orchestrator()
    res = orc.run_workflow("correction", "H2 and oxygen makes water")
    assert res["feature"] == "correction"
    assert "corrected" in res