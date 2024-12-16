// Expense Tracker Code

// Data store for the expenses (synthetic data)
let expenses = [
    { id: 1, date: '2024-12-01', category: 'Food', amount: 20.5, description: 'Lunch' },
    { id: 2, date: '2024-12-03', category: 'Transport', amount: 15, description: 'Bus fare' },
    { id: 3, date: '2024-12-10', category: 'Shopping', amount: 150, description: 'Clothes' },
    { id: 4, date: '2024-12-15', category: 'Food', amount: 30, description: 'Dinner' },
];

// Helper to generate unique IDs
const generateId = () => Math.max(0, ...expenses.map((expense) => expense.id)) + 1;

/**
 * Adds a new expense to the tracker.
 * @param {string} date - Date of the expense (YYYY-MM-DD).
 * @param {string} category - Category of the expense (e.g., Food, Transport).
 * @param {number} amount - Amount spent.
 * @param {string} description - Short description of the expense.
 */
function addExpense(date, category, amount, description) {
    const id = generateId();
    expenses.push({ id, date, category, amount, description });
    console.log(`Expense added: ${description} - $${amount}`);
}

/**
 * Edits an existing expense.
 * @param {number} id - ID of the expense to edit.
 * @param {object} updates - Object containing updated fields (e.g., { amount: 25 }).
 */
function editExpense(id, updates) {
    const expense = expenses.find((expense) => expense.id === id);
    if (!expense) {
        console.error('Expense not found!');
        return;
    }
    Object.assign(expense, updates);
    console.log(`Expense ID ${id} updated.`);
}

/**
 * Deletes an expense by its ID.
 * @param {number} id - ID of the expense to delete.
 */
function deleteExpense(id) {
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index === -1) {
        console.error('Expense not found!');
        return;
    }
    expenses.splice(index, 1);
    console.log(`Expense ID ${id} deleted.`);
}

/**
 * Generates a summary report of total spending by category.
 */
function generateCategorySummary() {
    const summary = {};
    expenses.forEach((expense) => {
        if (!summary[expense.category]) summary[expense.category] = 0;
        summary[expense.category] += expense.amount;
    });
    console.log('Spending by Category:', summary);
    return summary;
}

/**
 * Generates a monthly spending report.
 * @param {string} month - Month to filter by (format: YYYY-MM).
 */
function generateMonthlyReport(month) {
    const monthlyExpenses = expenses.filter((expense) => expense.date.startsWith(month));
    const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    console.log(`Total spending for ${month}: $${total}`);
    return total;
}

/**
 * Finds the most expensive expense in the tracker.
 */
function findMostExpensiveExpense() {
    if (expenses.length === 0) {
        console.log('No expenses recorded.');
        return null;
    }
    const maxExpense = expenses.reduce((max, expense) => (expense.amount > max.amount ? expense : max));
    console.log('Most Expensive Expense:', maxExpense);
    return maxExpense;
}

/**
 * Prints a detailed list of all expenses.
 */
function printAllExpenses() {
    console.log('All Expenses:');
    expenses.forEach(({ id, date, category, amount, description }) =>
        console.log(`#${id} | ${date} | ${category} | $${amount} | ${description}`)
    );
}

// Testing the Expense Tracker with synthetic data
console.log('--- Initial Data ---');
printAllExpenses();

console.log('\n--- Adding a New Expense ---');
addExpense('2024-12-18', 'Entertainment', 50, 'Movie night');
printAllExpenses();

console.log('\n--- Editing an Existing Expense ---');
editExpense(2, { amount: 20, description: 'Taxi fare' });
printAllExpenses();

console.log('\n--- Deleting an Expense ---');
deleteExpense(3);
printAllExpenses();

console.log('\n--- Generating Category Summary ---');
generateCategorySummary();

console.log('\n--- Generating Monthly Report ---');
generateMonthlyReport('2024-12');

console.log('\n--- Finding Most Expensive Expense ---');
findMostExpensiveExpense();
