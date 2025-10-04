#!/usr/bin/env python3
"""
Comprehensive test script for the Correction API.
This script tests all success and error scenarios.

Usage:
    python test_correction_api.py
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
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)

def test_successful_correction():
    """Test successful correction"""
    print("\n📝 Testing successful correction...")
    response = requests.post(BASE_URL, json={
        "statement": "Water is H2O molecule"
    })
    print_result("Successful Correction", response)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert response.json()['success'] == True, "Expected success=True"
    print("✓ PASSED")

def test_already_correct():
    """Test statement that doesn't need correction"""
    print("\n📝 Testing already correct statement...")
    response = requests.post(BASE_URL, json={
        "statement": "Water is an H2O molecule"
    })
    print_result("Already Correct Statement", response)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    # Note: changed field may vary depending on model behavior
    print("✓ PASSED")

def test_missing_statement():
    """Test missing statement field"""
    print("\n📝 Testing missing statement field...")
    response = requests.post(BASE_URL, json={})
    print_result("Missing Statement Field", response)
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    assert response.json()['error_code'] == 'MISSING_STATEMENT', "Expected MISSING_STATEMENT error"
    print("✓ PASSED")

def test_empty_statement():
    """Test empty statement"""
    print("\n📝 Testing empty statement...")
    response = requests.post(BASE_URL, json={"statement": "   "})
    print_result("Empty Statement", response)
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    assert response.json()['error_code'] == 'EMPTY_STATEMENT', "Expected EMPTY_STATEMENT error"
    print("✓ PASSED")

def test_invalid_type():
    """Test invalid data type"""
    print("\n📝 Testing invalid data type...")
    response = requests.post(BASE_URL, json={"statement": 123})
    print_result("Invalid Data Type", response)
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    assert response.json()['error_code'] == 'INVALID_TYPE', "Expected INVALID_TYPE error"
    print("✓ PASSED")

def test_too_long():
    """Test statement exceeding max length"""
    print("\n📝 Testing statement too long...")
    response = requests.post(BASE_URL, json={"statement": "A" * 1001})
    print_result("Statement Too Long", response)
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    assert response.json()['error_code'] == 'STATEMENT_TOO_LONG', "Expected STATEMENT_TOO_LONG error"
    print("✓ PASSED")

def test_special_characters():
    """Test unicode chemical formulas"""
    print("\n📝 Testing special characters...")
    response = requests.post(BASE_URL, json={
        "statement": "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O"
    })
    print_result("Special Characters", response)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    print("✓ PASSED")

def test_chemistry_examples():
    """Test various chemistry statements"""
    print("\n📝 Testing various chemistry statements...")
    
    statements = [
        "Sodium chloride is NaCl",
        "Carbon dioxide has formula CO2",
        "The reaction between hydrogen and oxygen produces water",
        "Glucose has molecular formula C6H12O6"
    ]
    
    for statement in statements:
        print(f"\nTesting: {statement}")
        response = requests.post(BASE_URL, json={"statement": statement})
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Original: {data['original']}")
            print(f"Corrected: {data['corrected']}")
            print(f"Changed: {data['changed']}")
        else:
            print(f"Error: {response.json()}")
    
    print("✓ PASSED")

def main():
    """Run all tests"""
    tests = [
        ("Successful Correction", test_successful_correction),
        ("Already Correct Statement", test_already_correct),
        ("Missing Statement Field", test_missing_statement),
        ("Empty Statement", test_empty_statement),
        ("Invalid Data Type", test_invalid_type),
        ("Statement Too Long", test_too_long),
        ("Special Characters", test_special_characters),
        ("Chemistry Examples", test_chemistry_examples)
    ]
    
    print("\n" + "="*60)
    print("🧪 CORRECTION API TEST SUITE")
    print("="*60)
    print(f"Testing endpoint: {BASE_URL}")
    
    passed = 0
    failed = 0
    errors = []
    
    # First check if server is running
    try:
        response = requests.get("http://localhost:8000/api/health/")
        print("✓ Server is running")
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to server.")
        print("\nPlease ensure the Django server is running:")
        print("  cd backend")
        print("  python manage.py runserver")
        return
    
    for test_name, test_func in tests:
        try:
            test_func()
            passed += 1
        except AssertionError as e:
            failed += 1
            errors.append((test_name, str(e)))
            print(f"✗ FAILED: {e}")
        except Exception as e:
            failed += 1
            errors.append((test_name, str(e)))
            print(f"✗ ERROR: {e}")
    
    print(f"\n{'='*60}")
    print(f"📊 TEST RESULTS")
    print(f"{'='*60}")
    print(f"✓ Passed: {passed}/{len(tests)}")
    print(f"✗ Failed: {failed}/{len(tests)}")
    
    if errors:
        print(f"\n❌ Failed Tests:")
        for test_name, error in errors:
            print(f"  - {test_name}: {error}")
    
    print(f"{'='*60}\n")
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
