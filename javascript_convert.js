#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const extractData = (filePath, type) => {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        let pattern;
        switch (type) {
            case 'ipaddress':
                pattern = /^\d\S+/gm; // Matches IP addresses
                break;
            case 'timestamp':
                pattern = /.{26}(?<=\d)\]/g; // Matches timestamps
                break;
            case 'httpmethod':
                pattern = /"(?=\w)(\w+.*?\w)"/g; // Matches HTTP methods
                break;
            case 'statuscode':
                pattern = /"\s\d{3}\s(\d{3})/g; // Matches status codes after HTTP methods
                break;
            case 'responsesize':
                pattern = /\d+$/gm; // Matches response sizes
                break;
            default:
                console.error(`Log Data '${type}' doesn't exist!!!`);
                return [];
        }
        return [...fileContents.matchAll(pattern)].map(match => match[1] || match[0]) || [];
    } catch (err) {
        console.error(`An error occurred: ${err.message}`);
        return [];
    }
};

const saveDataToFile = (data, filename) => {
    try {
        fs.writeFileSync(filename, data.join('\n'), 'utf8');
        console.log(`Data saved to ${filename}`);
    } catch (err) {
        console.error(`An error occurred: ${err.message}`);
    }
};

const promptUser = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
    }));
};

const main = async () => {
    if (process.argv.length === 4) {
        const filePath = process.argv[2];
        const type = process.argv[3];
        const extractedData = extractData(filePath, type);

        if (extractedData.length === 0) {
            console.log("No data found.");
            return;
        }

        const action = await promptUser("Do you want to view or save? ");
        if (action.toLowerCase() === 'save') {
            const filename = await promptUser("Enter a file name: ");
            saveDataToFile(extractedData, filename);
        } else if (action.toLowerCase() === 'view') {
            console.log(extractedData.join('\n'));
        } else {
            console.log(extractedData.join('\n'));
        }
    } else {
        const filePath = await promptUser("Enter file name: ");
        console.log("Which type of information would you like to extract?");
        console.log("ipaddress\ntimestamp\nhttpmethod\nstatuscode\nresponsesize");
        const type = await promptUser("Enter one of the options above: ");
        const extractedData = extractData(filePath, type);

        if (extractedData.length === 0) {
            console.log("No data found.");
            return;
        }

        const action = await promptUser("Do you want to view or save? ");
        if (action.toLowerCase() === 'save') {
            const filename = await promptUser("Enter a file name: ");
            saveDataToFile(extractedData, filename);
        } else if (action.toLowerCase() === 'view') {
            console.log(extractedData.join('\n'));
        } else {
            console.log(extractedData.join('\n'));
        }
    }
};

main();
