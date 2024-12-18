const fs = require('fs');
const path = require('path');
const { extractData, saveDataToFile } = require('./main'); // Adjust the path as necessary
jest.mock('fs');

describe('extractData', () => {
    let filePath;
    let mockFileContents;

    beforeEach(() => {
        filePath = path.resolve(__dirname, './logdata.txt');
        fs.readFileSync.mockResolvedValueOnce('123.45.67.89 [01/Jan/2020:12:00:00 -0700] "GET /path HTTP/1.1" 200 1024\n...more data');
    });

    it('should extract IP addresses', async () => {
        const result = await extractData(filePath, 'ipaddress');
        expect(result).toEqual(['123.45.67.89']);
    });

    it('should extract timestamps', async () => {
        const result = await extractData(filePath, 'timestamp');
        expect(result).toEqual(['[01/Jan/2020:12:00:00 -0700]']);
    });

    it('should extract HTTP methods', async () => {
        const result = await extractData(filePath, 'httpmethod');
        expect(result).toEqual(['GET']);
    });

    it('should extract status codes', async () => {
        const result = await extractData(filePath, 'statuscode');
        expect(result).toEqual(['200']);
    });

    it('should extract response sizes', async () => {
        const result = await extractData(filePath, 'responsesize');
        expect(result).toEqual(['1024']);
    });

    it('should handle invalid type by returning an empty array', async () => {
        const result = await extractData(filePath, 'invalid');
        expect(result).toEqual([]);
    });

    it('should handle file read error by returning an empty array', async () => {
        fs.readFileSync.mockRejectedValue(new Error('File not found'));
        const result = await extractData(filePath, 'ipaddress');
        expect(result).toEqual([]);
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('An error occurred'));
    });
});

describe('saveDataToFile', () => {
    let mockedData;
    let mockFilename;

    beforeEach(() => {
        mockedData = ['Line1', 'Line2'];
        mockFilename = 'output.txt';
        fs.writeFileSync.mockResolvedValue(undefined);
    });

    it('should save data to a file successfully', async () => {
        await saveDataToFile(mockedData, mockFilename);
        expect(fs.writeFileSync).toHaveBeenCalledWith(mockFilename, 'Line1\nLine2', 'utf8');
    });

    it('should handle a file write error', async () => {
        fs.writeFileSync.mockRejectedValue(new Error('Permission denied'));
        await saveDataToFile(mockedData, mockFilename);
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('An error occurred'));
    });
});
