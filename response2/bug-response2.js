const fs = require('fs');
const path = require('path');

// Revised function to better handle and count words, sentences and paragraphs.
function analyzeTextFile(filepath) {
    try {
        const content = fs.readFileSync(filepath, 'utf-8');
        
        if (!content.trim()) {
            throw new Error('The file is empty.');
        }
        
        // Split the text into paragraphs
        const paragraphs = content.split(/\r?\n\s*\n/);
        
        // Valid paragraphs are filtered out to include those containing non-whitespace characters.
        const validParagraphs = paragraphs.filter(paragraph => paragraph.trim() !== '');

        let wordCount = 0;
        let sentenceCount = 0;
        let paragraphCount = validParagraphs.length;

        for (const paragraph of validParagraphs) {
            // Split the paragraph into words (no whitespace and $ means the end of the 'line').
            const words = paragraph.split(/\s+/).filter(word => word);
            wordCount += words.length;

            // Each sentence ends with a period (.), a question mark (?), or an exclamation mark (!). 
            // .includes() will help count each of them outside the for loop iterating through each paragraph
            sentenceCount += paragraph.split(/[.!?]+/).length - 1;
        }
 
        return {
            word_count: wordCount,
            sentence_count: sentenceCount,
            paragraph_count: paragraphCount
        };
    } catch (err) {
        console.error(`Error analyzing file '${filepath}': ${err.message}`);
        return null;
    }
}

// Sample usage
const testFile = path.resolve(__dirname, 'testfile.txt');
const results = analyzeTextFile(testFile);

if (results) {
    console.log(`Total words: ${results.word_count}`);
    console.log(`Total sentences: ${results.sentence_count}`);
    console.log(`Total paragraphs: ${results.paragraph_count}`);
}
