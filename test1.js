function describePerson(person) {
    const descriptionParts = [
      'Name: ', person.name,
      ', Age: ', person.age,
      ', Hobbies: ', person.hobbies.join(', ')
    ];
    return descriptionParts.join('');
  }

// Test the describePerson function
function testDescribePerson() {
    const person = {
      name: "Alice",
      age: 30,
      hobbies: ["reading", "traveling", "swimming"]
    };
  
    const expectedOutput = "Name: Alice, Age: 30, Hobbies: reading, traveling, swimming";
    const actualOutput = describePerson(person);
    console.log(actualOutput);
    if (actualOutput === expectedOutput) {
      console.log("Test passed!");
    } else {
      console.log("Test failed!");
      console.log("Expected:", expectedOutput);
      console.log("Got:", actualOutput);
    }
  }
  
// Run the test
testDescribePerson();
  