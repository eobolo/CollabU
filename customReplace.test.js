const fs = require('fs');
const readline = require('readline');
const { extractData, saveDataToFile, promptUser } = require('./javascript_convert.js');
jest.mock('fs');

const REGEX_FILE_PATH = './regex_apache.log'; // Assume your regex test file path

describe('extractData', () => {
    test('extracts ipaddresses correctly', () => {
        fs.readFileSync.mockReturnValue('192.168.1.1 anothersource');
        const ipAddresses = extractData(REGEX_FILE_PATH, 'ipaddress');
        expect(ipAddresses).toEqual(['192.168.1.1']);
    });

    test('extracts timestamps correctly', () => {
        fs.readFileSync.mockReturnValue('[16/Dec/2021:00:00:00 +0000]');
        const timestamps = extractData(REGEX_FILE_PATH, 'timestamp');
        expect(timestamps).toEqual(['16/Dec/2021:00:00:00 +0000']);
    });

    test('extracts httpmethods correctly', () => {
        fs.readFileSync.mockReturnValue('"GET /path HTTP/1.1" 200 512');
        const methods = extractData(REGEX_FILE_PATH, 'httpmethod');
        expect(methods).toEqual(['GET /path HTTP/1.1']);
    });

    test('extracts statuscodes correctly', () => {
        fs.readFileSync.mockReturnValue('"GET /path HTTP/1.1" 200 512');
        const statusCodes = extractData(REGEX_FILE_PATH, 'statuscode');
        expect(statusCodes).toEqual(['200']);
    });

    test('extracts responsesizes correctly', () => {
        fs.readFileSync.mockReturnValue('512');
        const sizes = extractData(REGEX_FILE_PATH, 'responsesize');
        expect(sizes).toEqual(['512']);
    });

    test('returns an empty array for invalid type', () => {
        fs.readFileSync.mockReturnValue('192.168.1.1 anothersource');
        const ipAddresses = extractData(REGEX_FILE_PATH, 'invalidtype');
        expect(ipAddresses).toEqual([]);
    });
});

describe('saveDataToFile', () => {
    it('saves data to a file', async () => {
        const data = ['line1', 'line2'];
        fs.writeFileSync.mockImplementationOnce(() => { });
        await saveDataToFile(data, 'output.txt');
        expect(fs.writeFileSync).toHaveBeenCalledWith('output.txt', 'line1\nline2', 'utf8');
    });

    it('catches and logs permission errors', async () => {
        const data = ['line1', 'line2'];
        fs.writeFileSync.mockImplementationOnce(() => { throw new Error('Permission denied'); });
        await saveDataToFile(data, 'output.txt');
        expect(fs.writeFileSync).toHaveBeenCalledWith('output.txt', 'line1\nline2', 'utf8');
        expect(console.error).toHaveBeenCalledWith(expect.any(String));
    });
});

describe('promptUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('resolves with user input', async () => {
        const readlineMock = {
            question: jest.fn(() => 'output').mockResolvedValue('output'),
            close: jest.fn().mockResolvedValue()
        };
        const mockRl = readline.createInterface;
        mockRl.mockImplementationOnce(() => readlineMock);

        const response = await promptUser('Question:');
        expect(response).toBe('output');
        expect(readlineMock.question).toHaveBeenCalledWith('Question:');
    });
});
