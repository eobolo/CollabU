const fs = require('fs');

function analyzeTextFile(filepath) {
    /**
     * Analyzes a text file to count words, sentences, and paragraphs.
     *
     * @param {string} filepath - The path to the text file.
     * @returns {object|null} - A dictionary containing the counts of words, sentences, and paragraphs,
     * or null if an error occurs.
     */

    let content;

    try {
        content = fs.readFileSync(filepath, 'utf-8');
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error(`Error: File not found at '${filepath}'`);
        } else {
            console.error(`An error occurred: ${err.message}`);
        }
        return null;
    }

    // Strip all whitespace and check if the content is empty
    if (!content.replace(/\s/g, '').trim()) {
        console.error("Error: The file contains no text content.");
        return null;
    }

    const paragraphs = content.split(/\n\s*\n/);
    const validParagraphs = paragraphs.filter(paragraph => /[a-zA-Z]/.test(paragraph));

    let wordCount = 0;
    let sentenceCount = 0;
    const paragraphCount = validParagraphs.length;

    for (const paragraph of validParagraphs) {
        const words = paragraph.match(/\b[a-zA-Z0-9']+\b/g) || [];
        wordCount += words.length;

        const sentences = paragraph.match(/(?<=[.!?])\s*/g) || [];
        sentenceCount += sentences.length;
    }

    return {
        word_count: wordCount,
        sentence_count: sentenceCount,
        paragraph_count: paragraphCount
    };
}

const filepath = "testfile.txt";
const results = analyzeTextFile(filepath);

if (results) {
    console.log(`Total words: ${results.word_count}`);
    console.log(`Total sentences: ${results.sentence_count}`);
    console.log(`Total paragraphs: ${results.paragraph_count}`);
}
