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

    // Try reading the file
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

    // Check if the file is empty
    if (!content.trim()) {
        console.error("Error: The file is empty.");
        return null;
    }

    // Split the content by double newlines to identify paragraphs
    const paragraphs = content.split(/\n\s*\n/);
    const validParagraphs = paragraphs.filter(paragraph => /[a-zA-Z]/.test(paragraph));

    let wordCount = 0;
    let sentenceCount = 0;
    const paragraphCount = validParagraphs.length;

    for (const paragraph of validParagraphs) {
        // Count words, including numbers and valid contractions
        const words = paragraph.match(/\b[a-zA-Z0-9']+\b/g) || [];
        wordCount += words.length;

        // Count sentences using . ! ? without requiring space after punctuation
        const sentences = paragraph.match(/[.!?]/g) || [];
        sentenceCount += sentences.length;
    }

    return {
        word_count: wordCount,
        sentence_count: sentenceCount,
        paragraph_count: paragraphCount
    };
}

// Example usage
const filepath = "testfile.txt"; // Replace with your file path
const results = analyzeTextFile(filepath);

if (results) {
    console.log(`Total words: ${results.word_count}`);
    console.log(`Total sentences: ${results.sentence_count}`);
    console.log(`Total paragraphs: ${results.paragraph_count}`);
}
