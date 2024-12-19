const fs = require('fs');
const { extractData, saveDataToFile } = require('./javascript_convert.js');

jest.mock('fs');

describe('extractData', () => {
    const logData = `
        127.0.0.1 - - [10/Oct/2020:13:55:36 -0700] "GET /index.html HTTP/1.1" 200 1024
        192.168.1.1 - - [11/Oct/2020:17:45:22 -0700] "POST /form HTTP/1.0" 404 2048
    `;

    beforeAll(() => {
        fs.readFileSync.mockReturnValue(logData);
        jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress console warnings during tests
    });

    afterAll(() => {
        console.warn.mockRestore();
    });

    test('extracts IP addresses', () => {
        const result = extractData('fakePath', 'ipaddress');
        expect(result).toEqual([]);
    });

    test('extracts timestamps', () => {
        const result = extractData('fakePath', 'timestamp');
        expect(result).toEqual(['10/Oct/2020:13:55:36 -0700', '11/Oct/2020:17:45:22 -0700']);
    });

    test('extracts HTTP methods', () => {
        const result = extractData('fakePath', 'httpmethod');
        expect(result).toEqual(['GET /index.html HTTP/1.1', 'POST /form HTTP/1.0']);
    });

    test('extracts status codes', () => {
        const result = extractData('fakePath', 'statuscode');
        expect(result).toEqual(["102", "204"]);
    });

    test('extracts response sizes', () => {
        const result = extractData('fakePath', 'responsesize');
        expect(result).toEqual(['1024', '2048']);
    });

    test('returns empty array for no matches', () => {
        fs.readFileSync.mockReturnValue('irrelevantData');
        const result = extractData('fakePath', 'ipaddress');
        expect(result).toEqual([]);
    });

    test('returns empty array for invalid type', () => {
        const result = extractData('fakePath', 'unknownType');
        expect(result).toEqual([]);
    });

    test('handles file read errors gracefully', () => {
        fs.readFileSync.mockImplementation(() => {
            throw new Error('File not found');
        });
        const result = extractData('invalidPath', 'ipaddress');
        expect(result).toEqual([]);
        expect(console.warn).not.toHaveBeenCalled(); // Ensure only relevant console outputs
    });
});

describe('saveDataToFile', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('saves data to file', () => {
        const data = ['127.0.0.1', '192.168.1.1'];
        const filename = 'output.txt';
        saveDataToFile(data, filename);
        expect(fs.writeFileSync).toHaveBeenCalledWith(filename, data.join('\n'), 'utf8');
    });

    test('handles errors when saving file', () => {
        fs.writeFileSync.mockImplementation(() => {
            throw new Error('Permission denied');
        });

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const data = ['127.0.0.1', '192.168.1.1'];
        saveDataToFile(data, 'output.txt');

        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('An error occurred'));

        consoleErrorSpy.mockRestore();
    });
});
