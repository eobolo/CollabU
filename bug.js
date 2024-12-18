function createRuler(N) {
    let ruler = " ";
    for (let i = 1; i <= N; i++) {
        ruler = ruler + i + ruler;
    }
    return ruler;
}

// Example Usage
const N = 4; // Length of the ruler
const result = createRuler(N);
console.log(result);