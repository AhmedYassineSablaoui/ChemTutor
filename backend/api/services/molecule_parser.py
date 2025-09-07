import re
import requests
from rdkit import Chem
from rdkit import RDLogger

RDLogger.DisableLog('rdApp.error')
PUBCHEM_BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound"

# Synonyms and local fallbacks
SYNONYMS = {
    "ethyl alcohol": "ethanol",
    "table salt": "sodium chloride",
    "baking soda": "sodium bicarbonate",
    "vinegar": "acetic acid",
    "wood alcohol": "methanol"
}
FALLBACKS = {
    "water": "O",
    "ethanol": "CCO",
    "methanol": "CO",
    "acetone": "CC(=O)C",
    "benzene": "c1ccccc1",
    "acetic acid": "CC(=O)O",
    "glucose": "C(C1C(C(C(C(O1)O)O)O)O)O",
    "sodium chloride": "[Na+].[Cl-]"
}

def fetch_from_pubchem(identifier: str, id_type: str = "name") -> str:
    """Fetch SMILES from PubChem by name, formula, cid, or inchikey."""
    url = f"{PUBCHEM_BASE}/{id_type}/{identifier}/property/CanonicalSMILES/TXT"
    resp = requests.get(url, timeout=10)
    if resp.status_code == 200 and resp.text.strip():
        return resp.text.strip()
    raise ValueError(f"No PubChem match for {id_type}: {identifier}")

def parse_molecule(user_input: str) -> str:
    """Parse molecule input into a valid SMILES string."""
    if not user_input or not user_input.strip():
        raise ValueError("Empty input is not allowed")

    query = user_input.strip()

    # 🔹 Synonyms
    if query.lower() in SYNONYMS:
        query = SYNONYMS[query.lower()]

    # 🔹 Local fallback
    if query.lower() in FALLBACKS:
        return FALLBACKS[query.lower()]

    # 🔹 CID
    if query.isdigit():
        return fetch_from_pubchem(query, id_type="cid")

    # 🔹 InChIKey
    if re.fullmatch(r"^[A-Z]{14}-[A-Z]{10}-[A-Z]$", query):
        return fetch_from_pubchem(query, id_type="inchikey")

    # 🔹 InChI
    if query.startswith("InChI="):
        mol = Chem.MolFromInchi(query)
        if mol:
            return Chem.MolToSmiles(mol)

    # 🔹 Formula
    if re.fullmatch(r"^([A-Z][a-z]?\d*)+$", query):
        try:
            return fetch_from_pubchem(query, id_type="formula")
        except Exception:
            pass

    # 🔹 Direct SMILES
    mol = Chem.MolFromSmiles(query)
    if mol:
        return Chem.MolToSmiles(mol)

    # 🔹 PubChem name lookup
    try:
        return fetch_from_pubchem(query, id_type="name")
    except Exception:
        raise ValueError(f"Unknown or unsupported molecule: '{user_input}'")
