from api.services.molecule_parser import parse_molecule

TEST_INPUTS = [
    # Direct SMILES
    "CCO",               # ethanol
    "c1ccccc1",          # benzene
    "O=C=O",             # carbon dioxide

    # InChI
    "InChI=1S/CH4/h1H4", # methane

    # Common names & synonyms
    "water",
    "glucose",
    "acetic acid",
    "ethyl alcohol",     # synonym for ethanol
    "table salt",        # synonym for NaCl
    "baking soda",       # synonym for NaHCO3
    "vinegar",           # synonym for acetic acid
    "wood alcohol",      # synonym for methanol

    # Molecular formulas
    "H2O",
    "C6H6",
    "C6H12O6",
    "NaCl",

    # PubChem CID
    "702",               # ethanol (CID 702)

    # InChIKey
    "LFQSCWFLJHTTHZ-UHFFFAOYSA-N",  # glucose

    # Invalid / edge cases
    "",
    "foobar123",
    "C@C@C"
]

def run_tests():
    for inp in TEST_INPUTS:
        print("=" * 60)
        print(f"Input: {inp}")
        try:
            result = parse_molecule(inp)
            print(f"✅ Parsed -> {result}")
        except Exception as e:
            print(f"❌ Failed -> {e}")

if __name__ == "__main__":
    run_tests()
