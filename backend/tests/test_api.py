from django.test import TestCase
from api.services.reaction_balancer import balance_reaction

class ReactionTests(TestCase):
    def test_balance(self):
        result = balance_reaction("H2 + O2 -> H2O")
        self.assertIn('2', result['balanced'])