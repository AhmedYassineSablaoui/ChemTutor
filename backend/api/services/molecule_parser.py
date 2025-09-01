from rdkit import Chem
import pubchempy as pcp
from rdkit.Chem import rdChemReactions  # For later reactions

def parse_molecule(input_str: str):
    """
    Parse input to RDKit Mol object.
    Supports formula, name, SMILES.
    """
    # Try as SMILES first
    mol = Chem.MolFromSmiles(input_str)
    if mol:
        return mol

    # Try as chemical name via PubChemPy
    try:
        compounds = pcp.get_compounds(input_str, 'name')
        if compounds:
            smiles = compounds[0].isomeric_smiles
            mol = Chem.MolFromSmiles(smiles)
            if mol:
                return mol
    except Exception:
        pass

    # Try as formula (InChI or fallback)
    try:
        mol = Chem.MolFromMolBlock(input_str)  # If SDF, etc.
        if mol:
            return mol
    except Exception:
        pass

    raise ValueError(f"Invalid molecule input: {input_str}")