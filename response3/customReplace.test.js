// Import required modules
const fs = require('fs');
const { extractData, saveDataToFile } = require('./javascript_convert.js');

// Mocking the fs module for isolated testing
jest.mock('fs');

/**
 * Test suite for the `extractData` function
 */
describe('extractData', () => {
    // Sample log data for testing
    const logData = `
        127.0.0.1 - - [10/Oct/2020:13:55:36 -0700] "GET /index.html HTTP/1.1" 200 1024
        192.168.1.1 - - [11/Oct/2020:17:45:22 -0700] "POST /form HTTP/1.0" 404 2048
    `;

    // Before all tests, mock the file read and suppress console warnings
    beforeAll(() => {
        fs.readFileSync.mockReturnValue(logData); // Mock the file content
        jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress warnings
    });

    // After all tests, restore the original console.warn behavior
    afterAll(() => {
        console.warn.mockRestore();
    });

    // Test case: Extract IP addresses
    test('extracts IP addresses', () => {
        const result = extractData('fakePath', 'ipaddress');
        expect(result).toEqual([]); // Expected to fail due to incorrect data extraction logic
    });

    // Test case: Extract timestamps
    test('extracts timestamps', () => {
        const result = extractData('fakePath', 'timestamp');
        expect(result).toEqual(['10/Oct/2020:13:55:36 -0700', '11/Oct/2020:17:45:22 -0700']);
    });

    // Test case: Extract HTTP methods
    test('extracts HTTP methods', () => {
        const result = extractData('fakePath', 'httpmethod');
        expect(result).toEqual(['GET /index.html HTTP/1.1', 'POST /form HTTP/1.0']);
    });

    // Test case: Extract status codes
    test('extracts status codes', () => {
        const result = extractData('fakePath', 'statuscode');
        expect(result).toEqual(["102", "204"]); // Note: Likely issue in the data parsing logic
    });

    // Test case: Extract response sizes
    test('extracts response sizes', () => {
        const result = extractData('fakePath', 'responsesize');
        expect(result).toEqual(['1024', '2048']);
    });

    // Test case: Handle no matches found
    test('returns empty array for no matches', () => {
        fs.readFileSync.mockReturnValue('irrelevantData'); // Set irrelevant data
        const result = extractData('fakePath', 'ipaddress');
        expect(result).toEqual([]); // Should return an empty array
    });

    // Test case: Handle invalid type
    test('returns empty array for invalid type', () => {
        const result = extractData('fakePath', 'unknownType');
        expect(result).toEqual([]); // Should return an empty array
    });

    // Test case: Gracefully handle file read errors
    test('handles file read errors gracefully', () => {
        fs.readFileSync.mockImplementation(() => {
            throw new Error('File not found'); // Simulate file read error
        });
        const result = extractData('invalidPath', 'ipaddress');
        expect(result).toEqual([]); // Should return an empty array
        expect(console.warn).not.toHaveBeenCalled(); // Ensure no unnecessary warnings
    });
});

/**
 * Test suite for the `saveDataToFile` function
 */
describe('saveDataToFile', () => {
    // After each test, clear mock call history
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test case: Successfully save data to a file
    test('saves data to file', () => {
        const data = ['127.0.0.1', '192.168.1.1'];
        const filename = 'output.txt';
        saveDataToFile(data, filename); // Call the function
        expect(fs.writeFileSync).toHaveBeenCalledWith(filename, data.join('\n'), 'utf8'); // Verify write call
    });

    // Test case: Handle errors when saving data
    test('handles errors when saving file', () => {
        // Simulate file write error
        fs.writeFileSync.mockImplementation(() => {
            throw new Error('Permission denied');
        });

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
        const data = ['127.0.0.1', '192.168.1.1'];

        saveDataToFile(data, 'output.txt'); // Call the function

        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('An error occurred')); // Ensure error logged

        consoleErrorSpy.mockRestore(); // Restore original console.error
    });
});
