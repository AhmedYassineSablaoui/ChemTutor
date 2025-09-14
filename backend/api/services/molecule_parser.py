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

# 🔹 Common chemical formulas mapped to SMILES (fast + offline)
FORMULA_MAP = {
    "H2": "[H][H]",        # hydrogen gas
    "O2": "O=O",           # oxygen gas
    "N2": "N#N",           # nitrogen gas
    "H2O": "O",            # water
    "CO2": "O=C=O",        # carbon dioxide
    "NH3": "N",            # ammonia
    "CH4": "C",            # methane
    "NaCl": "[Na+].[Cl-]"  # sodium chloride
}


def fetch_from_pubchem(identifier: str, id_type: str = "name") -> Chem.Mol:
    """Fetch molecule as RDKit Mol from PubChem by name, formula, cid, or inchikey."""
    url = f"{PUBCHEM_BASE}/{id_type}/{identifier}/property/CanonicalSMILES/TXT"
    resp = requests.get(url, timeout=10)
    if resp.status_code == 200 and resp.text.strip():
        smiles = resp.text.strip()
        mol = Chem.MolFromSmiles(smiles)
        if mol:
            return mol
    raise ValueError(f"No PubChem match for {id_type}: {identifier}")


def parse_molecule(user_input: str) -> Chem.Mol:
    """Parse molecule input into an RDKit Mol object."""
    if not user_input or not user_input.strip():
        raise ValueError("Empty input is not allowed")

    query = user_input.strip()

    # 🔹 Synonyms
    if query.lower() in SYNONYMS:
        query = SYNONYMS[query.lower()]

    # 🔹 Local fallback
    if query.lower() in FALLBACKS:
        mol = Chem.MolFromSmiles(FALLBACKS[query.lower()])
        if mol:
            return mol

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
            return mol

    # 🔹 Formula (try local map first, then PubChem)
    if re.fullmatch(r"^([A-Z][a-z]?\d*)+$", query):
        if query in FORMULA_MAP:
            mol = Chem.MolFromSmiles(FORMULA_MAP[query])
            if mol:
                return mol
        try:
            return fetch_from_pubchem(query, id_type="formula")
        except Exception:
            pass

    # 🔹 Direct SMILES
    mol = Chem.MolFromSmiles(query)
    if mol:
        return mol

    # 🔹 PubChem name lookup
    try:
        return fetch_from_pubchem(query, id_type="name")
    except Exception:
        pass

    raise ValueError(f"Unknown or unsupported molecule: '{user_input}'")
