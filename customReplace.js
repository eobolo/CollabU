// customReplace function
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

// Jest tests
describe("customReplace", () => {
    test("should replace a single occurrence of a substring", () => {
        expect(customReplace("Hello world", "world", "earth")).toBe("Hello earth");
    });

    test("should handle multiple occurrences of a substring", () => {
        expect(customReplace("Hello world, welcome to the world", "world", "earth")).toBe("Hello earth, welcome to the earth");
    });

    test("should handle substrings at the start of a string", () => {
        expect(customReplace("World is amazing", "World", "Planet")).toBe("Planet is amazing");
    });

    test("should handle substrings at the end of a string", () => {
        expect(customReplace("The sky is blue", "blue", "green")).toBe("The sky is green");
    });

    test("should handle no occurrences of a substring", () => {
        expect(customReplace("Hello world", "universe", "earth")).toBe("Hello world");
    });

    test("should replace with an empty replacement string", () => {
        expect(customReplace("Hello world", "world", "")).toBe("Hello ");
    });

    test("should handle edge case with a substring of length 1", () => {
        expect(customReplace("abcdef", "c", "X")).toBe("abXdef");
    });

    test("should handle special characters", () => {
        expect(customReplace("This is an example!", "example", "sample")).toBe("This is an sample!");
    });

    test("should throw an error for replacing an empty substring", () => {
        expect(() => customReplace("Hello", "", "world")).toThrowError("Cannot replace an empty substring");
    });

    test("should throw an error for undefined parameters", () => {
        expect(() => customReplace(undefined, "sub", "rep")).toThrowError("Undefined parameter detected");
        expect(() => customReplace("actual", undefined, "rep")).toThrowError("Undefined parameter detected");
        expect(() => customReplace("actual", "sub", undefined)).toThrowError("Undefined parameter detected");
    });
});
