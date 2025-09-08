# tests/test_reaction_balancer.py
from api.services.reaction_balancer import balance_reaction

TEST_REACTIONS = [
    "H2 + O2 -> H2O",
    "C + O2 -> CO2",
    "CH4 + O2 -> CO2 + H2O",
    "NaOH + HCl -> NaCl + H2O",
    "C6H12O6 + O2 -> CO2 + H2O",
    "Fe + O2 -> Fe2O3",
    "AgNO3 + NaCl -> AgCl + NaNO3",
    "CaCO3 -> CaO + CO2",
    "H2SO4 + NaOH -> Na2SO4 + H2O",
    "N2 + H2 -> NH3",
    "foobar -> baz",  # invalid
]

if __name__ == "__main__":
    for reaction in TEST_REACTIONS:
        print("=" * 60)
        print(f"Input: {reaction}")
        try:
            result = balance_reaction(reaction)
            print(f"✅ Balanced -> {result['balanced']}")
            print(f"   Type     -> {result['type']}")

            print("   Oxidation States:")
            for side, states_list in result['oxidation_states'].items():
                print(f"    {side.capitalize()}:")
                for idx, atom_states in enumerate(states_list):
                    print(f"      Mol {idx+1}: {atom_states}")

        except Exception as e:
            print(f"❌ Failed -> {e}")
