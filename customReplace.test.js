const fs = require('fs');
const { extractData, saveDataToFile, promptUser } = require('./javascript_convert.js'); // Adjust file import as needed

jest.mock('fs');
jest.mock('readline');

// Mock data to represent contents of regex_apache.log
const mockLogData = `
123.45.67.89 - - [12/Nov/2021:11:22:33 +0000] "GET /index.html HTTP/1.1" 200 1043
987.65.43.21 - - [12/Nov/2021:11:22:34 +0000] "POST /form HTTP/1.1" 404 512
`;

describe('extractData', () => {
    beforeEach(() => {
        fs.readFileSync.mockReturnValue(mockLogData);
    });

    test('should extract IP addresses', () => {
        const result = extractData('regex_apache.log', 'ipaddress');
        expect(result).toEqual(['123.45.67.89', '987.65.43.21']);
    });

    test('should extract timestamps', () => {
        const result = extractData('regex_apache.log', 'timestamp');
        expect(result).toEqual(['12/Nov/2021:11:22:33 +0000', '12/Nov/2021:11:22:34 +0000']);
    });

    test('should extract HTTP methods', () => {
        const result = extractData('regex_apache.log', 'httpmethod');
        expect(result).toEqual(['GET /index.html HTTP/1.1', 'POST /form HTTP/1.1']);
    });

    test('should extract status codes', () => {
        const result = extractData('regex_apache.log', 'statuscode');
        expect(result).toEqual(['200', '404']);
    });

    test('should extract response sizes', () => {
        const result = extractData('regex_apache.log', 'responsesize');
        expect(result).toEqual(['1043', '512']);
    });

    test('should return empty array for invalid type', () => {
        const result = extractData('regex_apache.log', 'invalidtype');
        expect(result).toEqual([]);
    });
});

describe('saveDataToFile', () => {
    test('should save data to a file', () => {
        const data = ['Some data', 'Another line'];
        saveDataToFile(data, 'output.txt');
        expect(fs.writeFileSync).toHaveBeenCalledWith('output.txt', 'Some data\nAnother line', 'utf8');
    });

    test('should handle file system errors', () => {
        fs.writeFileSync.mockImplementation(() => { throw new Error('Permission denied') });
        console.error = jest.fn();

        saveDataToFile(['Some data'], 'output.txt');
        expect(console.error).toHaveBeenCalledWith('An error occurred: Permission denied');
    });
});

describe('promptUser', () => {
    const readlineMock = {
        question: jest.fn(),
        close: jest.fn(),
    };

    jest.spyOn(require('readline'), 'createInterface').mockReturnValue(readlineMock);

    test('should return user input after prompting', async () => {
        readlineMock.question.mockImplementation((questionText, callback) => callback('view'));

        const answer = await promptUser('Do you want to view or save?');
        expect(answer).toBe('view');
    });

    test('should handle empty input', async () => {
        readlineMock.question.mockImplementation((questionText, callback) => callback(''));

        const answer = await promptUser('Enter a command:');
        expect(answer).toBe('');
    });
});
