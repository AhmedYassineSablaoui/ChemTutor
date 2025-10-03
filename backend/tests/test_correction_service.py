from api.services.correction_service import CorrectionService


def run_tests():
    service = CorrectionService()

    # Wrong factual statement
    test_input1 = "Water boils at 50 degrees Celsius."
    result1 = service.detect_errors(test_input1)
    print("\n🔍 Test 1 - Wrong Input:", test_input1)
    print("✅ Output:", result1)

    # Correct factual statement
    test_input2 = "Water boils at 100 degrees Celsius."
    result2 = service.detect_errors(test_input2)
    print("\n🔍 Test 2 - Correct Input:", test_input2)
    print("✅ Output:", result2)

    # Chemistry syntax example
    test_input3 = "H20 is the chemical formula for water."
    result3 = service.detect_errors(test_input3)
    print("\n🔍 Test 3 - Syntax Error Input:", test_input3)
    print("✅ Output:", result3)


if __name__ == "__main__":
    print("🚀 Running CorrectionService tests...\n")
    run_tests()
