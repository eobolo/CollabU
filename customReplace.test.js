// Importing the customReplace function
import customReplace from './customReplace';

describe('customReplace Function Tests', () => {
    // Test 1: Basic single replacement
    test('Replaces a single occurrence of a substring', () => {
        const result = customReplace('hello world', 'world', 'everyone');
        expect(result).toBe('hello everyone');
    });

    // Test 2: No match found
    test('Returns original string if no match is found', () => {
        const result = customReplace('hello world', 'foo', 'bar');
        expect(result).toBe('hello world');
    });

    // Test 3: Replace substring at the start of the string
    test('Replaces substring at the start of the string', () => {
        const result = customReplace('hello world', 'hello', 'hi');
        expect(result).toBe('hi world');
    });

    // Test 4: Replace substring at the end of the string
    test('Replaces substring at the end of the string', () => {
        const result = customReplace('hello world', 'world', 'everyone');
        expect(result).toBe('hello everyone');
    });

    // Test 5: Replace multiple occurrences
    test('Replaces all occurrences of a substring', () => {
        const result = customReplace('hello world, world', 'world', 'everyone');
        expect(result).toBe('hello everyone, everyone');
    });

    // Test 6: Handle empty substring
    test('Handles empty substring gracefully', () => {
        const result = customReplace('hello', '', 'X');
        expect(result).toBe('hello');
    });

    // Test 7: Replace with empty replacement string
    test('Replaces substring with an empty string', () => {
        const result = customReplace('hello world', 'world', '');
        expect(result).toBe('hello ');
    });

    // Test 8: Handle special characters
    test('Handles special characters in substring and replacement', () => {
        const result = customReplace('hello $world$', '$world$', 'everyone!');
        expect(result).toBe('hello everyone!');
    });

    // Test 9: Case sensitivity
    test('Ensures case sensitivity in matching', () => {
        const result = customReplace('Hello world', 'hello', 'hi');
        expect(result).toBe('Hello world');
    });

    // Test 10: Large input string
    test('Handles large input strings efficiently', () => {
        const largeString = 'a'.repeat(1000) + 'world';
        const result = customReplace(largeString, 'world', 'everyone');
        expect(result).toBe('a'.repeat(1000) + 'everyone');
    });

    // Test 11: Substring longer than input
    test('Handles case where substring is longer than input string', () => {
        const result = customReplace('hi', 'hello', 'hey');
        expect(result).toBe('hi');
    });

    // Test 12: Identical substring and replacement
    test('Does nothing if substring and replacement are identical', () => {
        const result = customReplace('hello world', 'world', 'world');
        expect(result).toBe('hello world');
    });

    // Test 13: Replace entire string
    test('Replaces the entire string if substring matches the whole string', () => {
        const result = customReplace('world', 'world', 'everyone');
        expect(result).toBe('everyone');
    });

    // Test 14: Overlapping substrings
    test('Handles overlapping substrings correctly', () => {
        const result = customReplace('aaa', 'aa', 'b');
        expect(result).toBe('ba');
    });

    // Test 15: Invalid inputs
    test('Handles undefined input string gracefully', () => {
        expect(() => customReplace(undefined, 'world', 'everyone')).toThrow();
    });

    test('Handles null substring gracefully', () => {
        expect(() => customReplace('hello world', null, 'everyone')).toThrow();
    });

    test('Handles undefined replacement string gracefully', () => {
        expect(() => customReplace('hello world', 'world', undefined)).toThrow();
    });

    // Test 16: Unicode characters
    test('Handles Unicode characters correctly', () => {
        const result = customReplace('你好，世界', '世界', '朋友');
        expect(result).toBe('你好，朋友');
    });

    // Test 17: Numbers in strings
    test('Replaces substrings containing numbers correctly', () => {
        const result = customReplace('123-456-789', '456', '999');
        expect(result).toBe('123-999-789');
    });

    // Test 18: Consecutive substrings
    test('Handles consecutive substrings correctly', () => {
        const result = customReplace('aaa', 'a', 'b');
        expect(result).toBe('bbb');
    });

    // Test 19: Empty input string
    test('Handles empty input string gracefully', () => {
        const result = customReplace('', 'world', 'everyone');
        expect(result).toBe('');
    });

    // Test 20: Performance test with extremely large inputs
    test('Handles extremely large input strings', () => {
        const largeInput = 'a'.repeat(10 ** 6) + 'world';
        const result = customReplace(largeInput, 'world', 'everyone');
        expect(result).toBe('a'.repeat(10 ** 6) + 'everyone');
    });
});
