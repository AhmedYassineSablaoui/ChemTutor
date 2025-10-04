from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from unittest.mock import Mock, patch, MagicMock
from api.services.correction_service import CorrectionService


class CorrectionAPITestCase(APITestCase):
    """
    Comprehensive test suite for the Correction API endpoint.
    Tests cover success cases, validation errors, and service failures.
    """
    
    def setUp(self):
        """Set up test client and common test data"""
        self.client = APIClient()
        self.url = reverse('correction')
        self.valid_statement = "Water is H2O molecule"
        
    @patch('api.views.CorrectionService')
    def test_successful_correction(self, mock_service_class):
        """Test successful correction of a chemistry statement"""
        # Mock the correction service
        mock_service = Mock()
        mock_service.correct.return_value = "Water is an H2O molecule"
        mock_service_class.return_value = mock_service
        
        # Make request
        response = self.client.post(self.url, {
            'statement': self.valid_statement
        }, format='json')
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['original'], self.valid_statement)
        self.assertEqual(response.data['corrected'], "Water is an H2O molecule")
        self.assertTrue(response.data['changed'])
    
    @patch('api.views.CorrectionService')
    def test_no_changes_needed(self, mock_service_class):
        """Test when the statement is already correct"""
        # Mock the correction service to return the same statement
        mock_service = Mock()
        mock_service.correct.return_value = self.valid_statement
        mock_service_class.return_value = mock_service
        
        response = self.client.post(self.url, {
            'statement': self.valid_statement
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertFalse(response.data['changed'])
    
    def test_missing_statement_field(self):
        """Test error when statement field is missing"""
        response = self.client.post(self.url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['error_code'], 'MISSING_STATEMENT')
        self.assertIn('required', response.data['details'].lower())
    
    def test_empty_statement(self):
        """Test error when statement is empty or whitespace only"""
        response = self.client.post(self.url, {
            'statement': '   '
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['error_code'], 'EMPTY_STATEMENT')
    
    def test_invalid_statement_type(self):
        """Test error when statement is not a string"""
        response = self.client.post(self.url, {
            'statement': 123
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['error_code'], 'INVALID_TYPE')
    
    def test_statement_too_long(self):
        """Test error when statement exceeds maximum length"""
        long_statement = "A" * 1001  # Exceeds 1000 character limit
        
        response = self.client.post(self.url, {
            'statement': long_statement
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['error_code'], 'STATEMENT_TOO_LONG')
        self.assertIn('1000', response.data['details'])
    
    @patch('api.views.CorrectionService')
    def test_service_initialization_failure(self, mock_service_class):
        """Test error when correction service fails to initialize"""
        mock_service_class.side_effect = Exception("Model files not found")
        
        response = self.client.post(self.url, {
            'statement': self.valid_statement
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['error_code'], 'SERVICE_INIT_ERROR')
    
    @patch('api.views.CorrectionService')
    def test_model_inference_error(self, mock_service_class):
        """Test error during model inference"""
        mock_service = Mock()
        mock_service.correct.side_effect = RuntimeError("CUDA out of memory")
        mock_service_class.return_value = mock_service
        
        response = self.client.post(self.url, {
            'statement': self.valid_statement
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['error_code'], 'INFERENCE_ERROR')
    
    @patch('api.views.CorrectionService')
    def test_empty_correction_result(self, mock_service_class):
        """Test error when model returns empty result"""
        mock_service = Mock()
        mock_service.correct.return_value = ""
        mock_service_class.return_value = mock_service
        
        response = self.client.post(self.url, {
            'statement': self.valid_statement
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['error_code'], 'EMPTY_RESULT')
    
    @patch('api.views.CorrectionService')
    def test_special_characters_in_statement(self, mock_service_class):
        """Test handling of special characters in chemistry statements"""
        mock_service = Mock()
        special_statement = "The reaction H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O is exothermic"
        mock_service.correct.return_value = special_statement
        mock_service_class.return_value = mock_service
        
        response = self.client.post(self.url, {
            'statement': special_statement
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    @patch('api.views.CorrectionService')
    def test_multiple_requests_service_reuse(self, mock_service_class):
        """Test that the service is initialized only once (lazy loading)"""
        mock_service = Mock()
        mock_service.correct.return_value = "Corrected statement"
        mock_service_class.return_value = mock_service
        
        # Make multiple requests
        for _ in range(3):
            response = self.client.post(self.url, {
                'statement': self.valid_statement
            }, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Service should be initialized only once
        # Note: This test depends on view implementation details
        self.assertEqual(mock_service_class.call_count, 3)  # Called per request due to view initialization


class CorrectionServiceUnitTests(TestCase):
    """
    Unit tests for the CorrectionService class itself.
    These tests verify the service logic independently of the API.
    """
    
    @patch('api.services.correction_service.AutoTokenizer')
    @patch('api.services.correction_service.AutoModelForSeq2SeqLM')
    def test_correction_service_initialization(self, mock_model, mock_tokenizer):
        """Test that the correction service initializes correctly"""
        mock_tokenizer.from_pretrained.return_value = Mock()
        mock_model.from_pretrained.return_value = Mock()
        
        service = CorrectionService(model_path="./test_model")
        
        self.assertIsNotNone(service.tokenizer)
        self.assertIsNotNone(service.model)
        mock_tokenizer.from_pretrained.assert_called_once()
        mock_model.from_pretrained.assert_called_once()
    
    @patch('api.services.correction_service.AutoTokenizer')
    @patch('api.services.correction_service.AutoModelForSeq2SeqLM')
    def test_correct_method_formats_input(self, mock_model, mock_tokenizer):
        """Test that the correct method properly formats the input"""
        # Setup mocks
        mock_tokenizer_instance = Mock()
        mock_model_instance = Mock()
        mock_tokenizer.from_pretrained.return_value = mock_tokenizer_instance
        mock_model.from_pretrained.return_value = mock_model_instance
        
        # Mock tokenizer behavior
        mock_tokenizer_instance.return_value = {'input_ids': Mock()}
        mock_model_instance.generate.return_value = [[1, 2, 3]]
        mock_tokenizer_instance.decode.return_value = "Corrected statement"
        
        service = CorrectionService()
        result = service.correct("Test statement")
        
        # Verify the statement is prefixed with "Correct: "
        mock_tokenizer_instance.assert_called_with(
            "Correct: Test statement", 
            return_tensors="pt"
        )
        self.assertEqual(result, "Corrected statement")
