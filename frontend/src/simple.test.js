// Simple test that doesn't require complex setup
test('basic math works', () => {
  expect(2 + 2).toBe(4);
});

test('string operations work', () => {
  expect('hello'.toUpperCase()).toBe('HELLO');
});

test('array operations work', () => {
  const arr = [1, 2, 3];
  expect(arr.length).toBe(3);
  expect(arr.includes(2)).toBe(true);
});
