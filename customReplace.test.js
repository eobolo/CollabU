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
test('Replace single occurrence', () => {
  const input = "Hello, John!";
  const substring = "John";
  const replacement = "Jane";
  const expectedOutput = "Hello, Jane!";
  
  expect(customReplace(input, substring, replacement)).toBe(expectedOutput);
});

test('Replace multiple occurrences', () => {
  const input = "I like apples and apples are my favorite.";
  const substring = "apples";
  const replacement = "bananas";
  const expectedOutput = "I like bananas and bananas are my favorite.";
  
  expect(customReplace(input, substring, replacement)).toBe(expectedOutput);
});

test('Replace at the start of the string', () => {
  const input = "Hello, world!";
  const substring = "Hello";
  const replacement = "Hi";
  const expectedOutput = "Hi, world!";
  
  expect(customReplace(input, substring, replacement)).toBe(expectedOutput);
});

test('Replace at the end of the string', () => {
  const input = "Goodbye, world!";
  const substring = "world!";
  const replacement = "everyone!";
  const expectedOutput = "Goodbye, everyone!";
  
  expect(customReplace(input, substring, replacement)).toBe(expectedOutput);
});

test('Replace with an empty substring', () => {
  const input = "Hello, world!";
  const substring = "";
  const replacement = "Hi";
  const expectedOutput = "HiHello, world!";
  
  expect(customReplace(input, substring, replacement)).toBe(expectedOutput);
});

test('Replace with an empty replacement string', () => {
  const input = "Hello, John!";
  const substring = "John";
  const replacement = "";
  const expectedOutput = "Hello, !";
  
  expect(customReplace(input, substring, replacement)).toBe(expectedOutput);
});

test('Handle strings with special characters', () => {
  const input = "Hello, @user!";
  const substring = "@user";
  const replacement = "#user";
  const expectedOutput = "Hello, #user!";
  
  expect(customReplace(input, substring, replacement)).toBe(expectedOutput);
});

test('Handle undefined substring', () => {
  const input = "Hello, world!";
  const substring = undefined;
  const replacement = "everyone";
  const expectedOutput = "Hello, world!"; // since substring is undefined
  
  expect(customReplace(input, substring, replacement)).toBe(expectedOutput);
});

test('Handle undefined replacement', () => {
  const input = "Hello, John!";
  const substring = "John";
  const replacement = undefined;
  const expectedOutput = "Hello, John!"; // since replacement is undefined
  
  expect(customReplace(input, substring, replacement)).toBe(expectedOutput);
});

test('Handle empty string input', () => {
  const input = "";
  const substring = "Hello";
  const replacement = "Hi";
  const expectedOutput = ""; // no replacement can happen
  
  expect(customReplace(input, substring, replacement)).toBe(expectedOutput);
});

test('Performance with large strings', () => {
  const input = "a".repeat(10000) + "b" + "a".repeat(10000);
  const substring = "b";
  const replacement = "c";
  const expectedOutput = "a".repeat(10000) + "c" + "a".repeat(10000);
  
  expect(customReplace(input, substring, replacement)).toBe(expectedOutput);
});
