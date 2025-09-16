from .molecule_parser import parse_molecule
from rdkit.Chem import AllChem, rdDepictor
from typing import List, Dict
from rdkit import Chem
from .compound_lookup import lookup_compound


def parse_reaction(input_reaction: str) -> Dict:
    """
    Parse 'reactants -> products' string.
    """
    if '->' not in input_reaction:
        raise ValueError("Invalid reaction format. Use 'reactants -> products'")
    reactants_str, products_str = input_reaction.split('->')
    reactant_tokens = [r.strip() for r in reactants_str.split('+') if r.strip()]
    product_tokens = [p.strip() for p in products_str.split('+') if p.strip()]
    reactants = [parse_molecule(tok) for tok in reactant_tokens]
    products = [parse_molecule(tok) for tok in product_tokens]
    return {'reactants': reactants, 'products': products}

def _build_reaction(parsed: Dict) -> AllChem.ChemicalReaction:
    """Create an RDKit ChemicalReaction from parsed reactants/products."""
    rxn = AllChem.ChemicalReaction()
    for mol in parsed['reactants']:
        if not isinstance(mol, Chem.Mol):
            mol = parse_molecule(str(mol))
        rxn.AddReactantTemplate(mol)
    for mol in parsed['products']:
        if not isinstance(mol, Chem.Mol):
            mol = parse_molecule(str(mol))
        rxn.AddProductTemplate(mol)
    return rxn

def get_reaction_type(rxn: AllChem.ChemicalReaction) -> str:
    # Basic classification (expand later)
    if rxn.GetNumReactantTemplates() == 2 and rxn.GetNumProductTemplates() == 2:
        return "Double displacement"
    # Add more: redox if ox states change, etc.
    return "Unknown"

def calculate_oxidation_states(mol: 'Chem.Mol') -> Dict:
    # Use RDKit to compute (simplified)
    Chem.rdDepictor.Compute2DCoords(mol)
    states = {}
    for atom in mol.GetAtoms():
        states[atom.GetIdx()] = atom.GetFormalCharge()  # Placeholder; use better lib if needed
    return states

# Update balance_reaction to return dict with type, states, balanced
def balance_reaction(input_reaction: str) -> Dict:
    parsed = parse_reaction(input_reaction)
    rxn = _build_reaction(parsed)
    # Placeholder coefficients = 1 for all species (no automatic solver here)
    react_str = ' + '.join([f"1 {Chem.MolToSmiles(m)}" for m in parsed['reactants']])
    prod_str = ' + '.join([f"1 {Chem.MolToSmiles(m)}" for m in parsed['products']])
    rxn_type = get_reaction_type(rxn)
    ox_states = {
        'reactants': [calculate_oxidation_states(m) for m in parsed['reactants']],
        'products': [calculate_oxidation_states(m) for m in parsed['products']],
    }
    #metadata fetch 
    metadata = {}
    for side, tokens, mols in [
        ('reactants', input_reaction.split('->')[0].split('+'), parsed['reactants']),
        ('products', input_reaction.split('->')[1].split('+'), parsed['products'])
    ]:
        metadata[side] = []
        for token, mol in zip(tokens, mols):
            token = token.strip()
            meta = lookup_compound(token) or {}
            metadata[side].append({
                'coeff': 1,  # placeholder
                'input': token,
                'smiles': Chem.MolToSmiles(mol),
                'iupac': meta.get('iupac_name', 'Unknown'),
                'formula': meta.get('formula', 'Unknown'),
                'synonyms': meta.get('synonyms', []),
                'mol_weight': meta.get('molecular_weight', None)
            })

    return {
        'balanced': f"{react_str} -> {prod_str}",
        'type': rxn_type,
        'oxidation_states': ox_states,
        'metadata': metadata
    }