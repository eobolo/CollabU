/*
    recreating the string replace function
    :) :), with my custom function
*/
customReplace = function (actualString, subString, repString) {
    let newString = "";
    let newStringLength = actualString.length - subString.length + repString.length;
    let upCount = 0; 
    let indexCount = 0;
    let j = 0;
    for (let i = 0; i < actualString.length; i++) {
        if (subString[j] === actualString[i]) {
            upCount++;
            j++;
            if (upCount === subString.length) {
                indexCount = i;
                break;
            }
            continue;
        }
        upCount = 0;
        j = 0;
    }
    if (upCount === 0) {
        return actualString;
    }
    let startIndex = indexCount + 1 - subString.length;
    let endIndex = indexCount + 1;
    let checkDiff = 1 * (repString.length - subString.length);
    let checkRange = endIndex + checkDiff;
    let i = 0;
    let i$;
    while (i <= newStringLength) {
        if (i >= startIndex && i < checkRange) {
            newString += repString[i - startIndex];
            if (i === checkRange - 1) {
                i$ = i;
                i = i + (-1 * checkDiff) + 1;
            }
        }
        if (i$ >= checkRange - 1) {
            i$++;
            // make your checkRange negative here since i$ would always be greater than
            // or equal to check range but imagine
            // if your i is reduce to a very samll value the fist condition might be triggered
            // if is is greater than start index and i is less than check range
            checkRange = -10;
            if (actualString[i] === undefined) {
                i++
                continue
            }
            newString += actualString[i];
            i++
            continue;
        }
        if (!(i >= startIndex && i < checkRange)) {
            newString += actualString[i]
        }
        i++;
    }
    return customReplace(newString, subString, repString);
};

export default customReplace;