# Correction API Testing Guide

This guide provides comprehensive instructions for testing the Chemistry Statement Correction API.

## Table of Contents
1. [Running Automated Tests](#running-automated-tests)
2. [Manual API Testing](#manual-api-testing)
3. [Error Scenarios](#error-scenarios)
4. [Example Test Cases](#example-test-cases)

---

## Running Automated Tests

### Run All Tests
```bash
cd backend
python manage.py test api.tests.CorrectionAPITestCase
```

### Run Specific Test
```bash
python manage.py test api.tests.CorrectionAPITestCase.test_successful_correction
```

### Run with Verbose Output
```bash
python manage.py test api.tests.CorrectionAPITestCase --verbosity=2
```

### Run Service Unit Tests
```bash
python manage.py test api.tests.CorrectionServiceUnitTests
```

---

## Manual API Testing

### API Endpoint
- **URL**: `http://localhost:8000/api/correction/`
- **Method**: `POST`
- **Content-Type**: `application/json`

### 1. Using cURL

#### Successful Correction
```bash
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{"statement": "Water is H2O molecule"}'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "original": "Water is H2O molecule",
  "corrected": "Water is an H2O molecule",
  "changed": true
}
```

#### Already Correct Statement
```bash
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{"statement": "Water is an H2O molecule"}'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "original": "Water is an H2O molecule",
  "corrected": "Water is an H2O molecule",
  "changed": false
}
```

### 2. Using Python Requests

```python
import requests
import json

url = "http://localhost:8000/api/correction/"

# Test data
statements = [
    "Water is H2O molecule",
    "Sodium chloride is NaCl",
    "Carbon dioxide has formula CO2"
]

for statement in statements:
    response = requests.post(
        url,
        json={"statement": statement},
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")
```

### 3. Using HTTPie
```bash
http POST http://localhost:8000/api/correction/ statement="Water is H2O molecule"
```

### 4. Using Postman
1. Create a new POST request
2. Set URL: `http://localhost:8000/api/correction/`
3. Go to Headers tab:
   - Add `Content-Type: application/json`
4. Go to Body tab:
   - Select "raw" and "JSON"
   - Add: `{"statement": "Your chemistry statement here"}`
5. Click "Send"

---

## Error Scenarios

### 1. Missing Statement Field

**Request:**
```bash
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Missing required field: statement",
  "error_code": "MISSING_STATEMENT",
  "details": "The \"statement\" field is required in the request body"
}
```

### 2. Empty Statement

**Request:**
```bash
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{"statement": "   "}'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Statement cannot be empty",
  "error_code": "EMPTY_STATEMENT",
  "details": "Please provide a non-empty chemistry statement"
}
```

### 3. Invalid Data Type

**Request:**
```bash
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{"statement": 123}'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid data type for statement",
  "error_code": "INVALID_TYPE",
  "details": "Expected string, got int"
}
```

### 4. Statement Too Long

**Request:**
```bash
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d "{\"statement\": \"$(python -c 'print("A" * 1001)')\"}"
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Statement too long",
  "error_code": "STATEMENT_TOO_LONG",
  "details": "Statement length (1001) exceeds maximum of 1000 characters"
}
```

### 5. Service Initialization Error

This occurs when the model files are missing or corrupted.

**Response (503 Service Unavailable):**
```json
{
  "success": false,
  "error": "Correction service initialization failed",
  "error_code": "SERVICE_INIT_ERROR",
  "details": "The correction model could not be loaded. Please ensure the model files are present.",
  "debug_info": "Model files not found at ./models/correction_model" 
}
```

*Note: `debug_info` is only included for staff users*

### 6. Model Inference Error

This occurs when the model fails during prediction.

**Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Model inference failed",
  "error_code": "INFERENCE_ERROR",
  "details": "An error occurred during model prediction",
  "debug_info": "CUDA out of memory"
}
```

---

## Example Test Cases

### Chemistry Statement Corrections

#### Test Case 1: Grammar Correction
```bash
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{"statement": "Oxygen are essential for life"}'
```

#### Test Case 2: Chemical Formula
```bash
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{"statement": "The formula of glucose is C6H12O6"}'
```

#### Test Case 3: Chemical Reaction
```bash
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{"statement": "H2 + O2 → H2O"}'
```

#### Test Case 4: Complex Statement
```bash
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{"statement": "The reaction between sulfuric acid and sodium hydroxide produces sodium sulfate and water"}'
```

#### Test Case 5: Unicode Characters
```bash
curl -X POST http://localhost:8000/api/correction/ \
  -H "Content-Type: application/json" \
  -d '{"statement": "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O"}'
```

---

## Complete Test Script

Save this as `test_correction_api.py`:

```python
#!/usr/bin/env python3
"""
Comprehensive test script for the Correction API.
This script tests all success and error scenarios.
"""

import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000/api/correction/"

def print_result(test_name: str, response: requests.Response):
    """Pretty print test results"""
    print(f"\n{'='*60}")
    print(f"Test: {test_name}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    print(f"Response:")
    print(json.dumps(response.json(), indent=2))

def test_successful_correction():
    """Test successful correction"""
    response = requests.post(BASE_URL, json={
        "statement": "Water is H2O molecule"
    })
    print_result("Successful Correction", response)
    assert response.status_code == 200
    assert response.json()['success'] == True

def test_already_correct():
    """Test statement that doesn't need correction"""
    response = requests.post(BASE_URL, json={
        "statement": "Water is an H2O molecule"
    })
    print_result("Already Correct Statement", response)
    assert response.status_code == 200
    assert response.json()['changed'] == False

def test_missing_statement():
    """Test missing statement field"""
    response = requests.post(BASE_URL, json={})
    print_result("Missing Statement Field", response)
    assert response.status_code == 400
    assert response.json()['error_code'] == 'MISSING_STATEMENT'

def test_empty_statement():
    """Test empty statement"""
    response = requests.post(BASE_URL, json={"statement": "   "})
    print_result("Empty Statement", response)
    assert response.status_code == 400
    assert response.json()['error_code'] == 'EMPTY_STATEMENT'

def test_invalid_type():
    """Test invalid data type"""
    response = requests.post(BASE_URL, json={"statement": 123})
    print_result("Invalid Data Type", response)
    assert response.status_code == 400
    assert response.json()['error_code'] == 'INVALID_TYPE'

def test_too_long():
    """Test statement exceeding max length"""
    response = requests.post(BASE_URL, json={"statement": "A" * 1001})
    print_result("Statement Too Long", response)
    assert response.status_code == 400
    assert response.json()['error_code'] == 'STATEMENT_TOO_LONG'

def test_special_characters():
    """Test unicode chemical formulas"""
    response = requests.post(BASE_URL, json={
        "statement": "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O"
    })
    print_result("Special Characters", response)
    assert response.status_code == 200

def main():
    """Run all tests"""
    tests = [
        test_successful_correction,
        test_already_correct,
        test_missing_statement,
        test_empty_statement,
        test_invalid_type,
        test_too_long,
        test_special_characters
    ]
    
    print("\n" + "="*60)
    print("CORRECTION API TEST SUITE")
    print("="*60)
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
            print(f"✓ PASSED")
        except AssertionError as e:
            failed += 1
            print(f"✗ FAILED: {e}")
        except requests.exceptions.ConnectionError:
            print("\n❌ ERROR: Cannot connect to server.")
            print("Please ensure the Django server is running:")
            print("  cd backend && python manage.py runserver")
            return
    
    print(f"\n{'='*60}")
    print(f"RESULTS: {passed} passed, {failed} failed")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
```

### Running the Test Script

```bash
# Make executable
chmod +x test_correction_api.py

# Run the script
python test_correction_api.py
```

---

## Error Codes Reference

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_STATEMENT` | 400 | Statement field is missing from request |
| `EMPTY_STATEMENT` | 400 | Statement is empty or whitespace only |
| `INVALID_TYPE` | 400 | Statement is not a string |
| `STATEMENT_TOO_LONG` | 400 | Statement exceeds 1000 characters |
| `SERVICE_INIT_ERROR` | 503 | Model failed to initialize |
| `INFERENCE_ERROR` | 500 | Model prediction failed |
| `EMPTY_RESULT` | 500 | Model returned empty result |
| `PROCESSING_ERROR` | 500 | Unexpected processing error |
| `INTERNAL_ERROR` | 500 | Unhandled server error |

---

## Debugging Tips

### 1. Check Server Logs
```bash
# Server logs show detailed error information
tail -f backend/logs/django.log
```

### 2. Enable Debug Mode
In `settings.py`, set:
```python
DEBUG = True
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
```

### 3. Verify Model Files
```bash
ls -la backend/models/correction_model/
# Should contain:
# - config.json
# - pytorch_model.bin (or model.safetensors)
# - tokenizer files
```

### 4. Test Service Directly
```python
from api.services.correction_service import CorrectionService

service = CorrectionService()
result = service.correct("Water is H2O molecule")
print(result)
```

---

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 -p test_data.json -T application/json http://localhost:8000/api/correction/
```

Where `test_data.json` contains:
```json
{"statement": "Water is H2O molecule"}
```

### Expected Response Times
- Model initialization: ~2-5 seconds (first request)
- Subsequent requests: ~100-500ms per correction
- Concurrent requests: Limited by model throughput

---

## Integration with Frontend

### JavaScript/React Example
```javascript
async function correctStatement(statement) {
  try {
    const response = await fetch('http://localhost:8000/api/correction/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ statement }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      return {
        original: data.original,
        corrected: data.corrected,
        changed: data.changed
      };
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Correction failed:', error);
    throw error;
  }
}

// Usage
correctStatement("Water is H2O molecule")
  .then(result => {
    console.log('Original:', result.original);
    console.log('Corrected:', result.corrected);
    console.log('Changed:', result.changed);
  })
  .catch(error => console.error('Error:', error));
```

---

## Troubleshooting

### Common Issues

1. **"Model files not found"**
   - Ensure the model is in `backend/models/correction_model/`
   - Check file permissions

2. **"CUDA out of memory"**
   - Reduce model batch size
   - Use CPU inference instead
   - Add to `correction_service.py`:
     ```python
     import torch
     self.device = "cpu"  # Force CPU
     ```

3. **Slow first request**
   - Model loads on first request (lazy loading)
   - Consider eager loading in `apps.py`

4. **Connection refused**
   - Ensure Django server is running: `python manage.py runserver`
   - Check firewall settings
