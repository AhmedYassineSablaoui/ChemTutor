# api/services/compound_lookup.py
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
            # ✅ keep synonyms under 50 chars, max 3
            'synonyms': [s for s in compound.synonyms if len(s) < 50][:3],
            'molecular_weight': compound.molecular_weight
        }
    except Exception as e:
        print(f"PubChem error: {e}")
        return None
