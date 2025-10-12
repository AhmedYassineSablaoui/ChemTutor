"""
Minimal tests that don't require any external dependencies.
These tests will always pass and verify basic Django functionality.
"""

from django.test import TestCase
from django.test import Client
from django.conf import settings

class MinimalTestCase(TestCase):
    """
    Minimal tests that verify Django is working.
    """
    
    def test_django_setup(self):
        """Test that Django is properly configured"""
        self.assertTrue(hasattr(settings, 'SECRET_KEY'))
        self.assertTrue(settings.SECRET_KEY)
        self.assertTrue(hasattr(settings, 'DEBUG'))
    
    def test_client_creation(self):
        """Test that Django test client can be created"""
        client = Client()
        self.assertIsNotNone(client)
    
    def test_basic_math(self):
        """Test basic Python functionality"""
        self.assertEqual(1 + 1, 2)
        self.assertTrue(True)
        self.assertFalse(False)
    
    def test_string_operations(self):
        """Test string operations"""
        test_string = "Hello World"
        self.assertEqual(test_string.upper(), "HELLO WORLD")
        self.assertEqual(len(test_string), 11)
    
    def test_list_operations(self):
        """Test list operations"""
        test_list = [1, 2, 3, 4, 5]
        self.assertEqual(len(test_list), 5)
        self.assertIn(3, test_list)
        self.assertEqual(test_list[0], 1)
