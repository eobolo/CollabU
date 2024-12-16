import { expect } from "chai";
import customReplace from "./customReplace.js";

describe("customReplace Function Tests", () => {
  
  // Basic Test Cases
  it("should replace a single occurrence of a substring", () => {
    const result = customReplace("hello world", "world", "everyone");
    expect(result).to.equal("hello everyone");
  });

  it("should return the original string when no match is found", () => {
    const result = customReplace("hello world", "foo", "bar");
    expect(result).to.equal("hello world");
  });

  it("should replace a substring at the start of the string", () => {
    const result = customReplace("hello world", "hello", "hi");
    expect(result).to.equal("hi world");
  });

  it("should replace a substring at the end of the string", () => {
    const result = customReplace("hello world", "world", "everyone");
    expect(result).to.equal("hello everyone");
  });

  it("should replace all occurrences of a substring", () => {
    const result = customReplace("hello world, world", "world", "everyone");
    expect(result).to.equal("hello everyone, everyone");
  });

  // Edge Cases
  it("should return the original string when replacing an empty substring", () => {
    const result = customReplace("hello", "", "X");
    expect(result).to.equal("hello");
  });

  it("should replace a substring with an empty string", () => {
    const result = customReplace("hello world", "world", "");
    expect(result).to.equal("hello ");
  });

  it("should handle special characters", () => {
    const result = customReplace("hello $world$", "$world$", "everyone!");
    expect(result).to.equal("hello everyone!");
  });

  it("should be case-sensitive", () => {
    const result = customReplace("Hello world", "hello", "hi");
    expect(result).to.equal("Hello world");
  });

  // Performance and Large Input
  it("should handle a large input string", () => {
    const largeString = "a".repeat(1000) + "world";
    const result = customReplace(largeString, "world", "everyone");
    expect(result).to.equal("a".repeat(1000) + "everyone");
  });

  // Miscellaneous Edge Cases
  it("should return the original string when the substring is longer than the input", () => {
    const result = customReplace("hi", "hello", "hey");
    expect(result).to.equal("hi");
  });

  it("should make no changes if the replacement is identical to the substring", () => {
    const result = customReplace("hello world", "world", "world");
    expect(result).to.equal("hello world");
  });

  it("should replace the entire string if the substring matches the whole string", () => {
    const result = customReplace("world", "world", "everyone");
    expect(result).to.equal("everyone");
  });

  it("should handle overlapping substrings correctly", () => {
    const result = customReplace("aaa", "aa", "b");
    expect(result).to.equal("ba");
  });

  // Invalid Inputs
  it("should handle undefined input gracefully", () => {
    expect(() => customReplace(undefined, "world", "everyone")).to.throw();
  });

  it("should handle null substring gracefully", () => {
    expect(() => customReplace("hello world", null, "everyone")).to.throw();
  });

  it("should handle undefined replacement string gracefully", () => {
    expect(() => customReplace("hello world", "world", undefined)).to.throw();
  });

  // Unicode and Numbers
  it("should support Unicode characters", () => {
    const result = customReplace("你好，世界", "世界", "朋友");
    expect(result).to.equal("你好，朋友");
  });

  it("should handle numbers in strings", () => {
    const result = customReplace("123-456-789", "456", "999");
    expect(result).to.equal("123-999-789");
  });

  it("should handle consecutive substrings correctly", () => {
    const result = customReplace("aaa", "a", "b");
    expect(result).to.equal("bbb");
  });

  it("should return an empty string if the input string is empty", () => {
    const result = customReplace("", "world", "everyone");
    expect(result).to.equal("");
  });

  it("should handle large input strings for performance", () => {
    const largeString = "a".repeat(10 ** 6) + "world";
    const result = customReplace(largeString, "world", "everyone");
    expect(result).to.equal("a".repeat(10 ** 6) + "everyone");
  });
});
