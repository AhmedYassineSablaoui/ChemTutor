import pubchempy as pcp
from typing import Dict, Optional

def lookup_compound(query: str) -> Optional[Dict]:
    """
    Fetch compound metadata via PubChem.
    """
    try:
        compounds = pcp.get_compounds(query, 'name') or pcp.get_compounds(query, 'formula')
        if not compounds:
            return None
        compound = compounds[0]
        return {
            'iupac_name': compound.iupac_name,
            'formula': compound.molecular_formula,
            'smiles': compound.isomeric_smiles,
            'synonyms': compound.synonyms[:5],  # Top 5 synonyms
            'molecular_weight': compound.molecular_weight
        }
    except Exception as e:
        print(f"PubChem error: {e}")
        return None