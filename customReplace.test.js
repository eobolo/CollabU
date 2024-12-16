/**
 * List of expenses with synthetic data.
 * Each expense has the following properties:
 * - id: Unique identifier for the expense.
 * - date: The date of the expense in YYYY-MM-DD format.
 * - category: Category of the expense (e.g., Food, Transport).
 * - amount: Amount spent on the expense.
 * - description: A brief description of the expense.
 */
let expenses = [
    { id: 1, date: '2024-12-01', category: 'Food', amount: 20.5, description: 'Lunch' },
    { id: 2, date: '2024-12-03', category: 'Transport', amount: 15, description: 'Bus fare' },
    { id: 3, date: '2024-12-10', category: 'Shopping', amount: 150, description: 'Clothes' },
    { id: 4, date: '2024-12-15', category: 'Food', amount: 30, description: 'Dinner' },
];

/**
 * Generates a unique ID for a new expense.
 * Finds the current maximum ID from the list and adds 1 to it.
 * @returns {number} A unique ID for the new expense.
 */
const generateId = () => Math.max(0, ...expenses.map((expense) => expense.id)) + 1;

/**
 * Adds a new expense to the list.
 * Validates the input before adding to ensure valid values.
 * @param {string} date - Date of the expense in YYYY-MM-DD format.
 * @param {string} category - Category of the expense (e.g., Food, Transport).
 * @param {number} amount - Amount spent on the expense.
 * @param {string} description - A brief description of the expense.
 * @throws Will throw an error if any input is invalid (e.g., negative amount or missing fields).
 */
function addExpense(date, category, amount, description) {
    if (amount < 0 || !date || !category || !description) {
        throw new Error('Invalid input');
    }
    const id = generateId();
    expenses.push({ id, date, category, amount, description });
}

/**
 * Edits an existing expense by its ID.
 * Updates only the provided fields while leaving others unchanged.
 * @param {number} id - The ID of the expense to edit.
 * @param {object} updates - An object containing the fields to update.
 */
function editExpense(id, updates) {
    const expense = expenses.find((expense) => expense.id === id);
    if (!expense) return;
    Object.assign(expense, updates);
}

/**
 * Deletes an expense by its ID.
 * If the ID does not exist, the function does nothing.
 * @param {number} id - The ID of the expense to delete.
 */
function deleteExpense(id) {
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index === -1) return;
    expenses.splice(index, 1);
}

/**
 * Generates a summary of total spending by category.
 * @returns {object} An object with categories as keys and total spending as values.
 */
function generateCategorySummary() {
    const summary = {};
    expenses.forEach((expense) => {
        if (!summary[expense.category]) summary[expense.category] = 0;
        summary[expense.category] += expense.amount;
    });
    return summary;
}

/**
 * Calculates the total spending for a specific month.
 * Filters the expenses by the given month and sums their amounts.
 * @param {string} month - The month to filter by, in YYYY-MM format.
 * @returns {number} The total spending for the given month.
 */
function generateMonthlyReport(month) {
    const monthlyExpenses = expenses.filter((expense) => expense.date.startsWith(month));
    const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return total;
}

/**
 * Finds the most expensive expense in the list.
 * @returns {object|null} The most expensive expense object or null if the list is empty.
 */
function findMostExpensiveExpense() {
    if (expenses.length === 0) return null;
    const maxExpense = expenses.reduce((max, expense) => (expense.amount > max.amount ? expense : max));
    return maxExpense;
}

/**
 * Formats all expenses in the list for display.
 * @returns {string[]} An array of formatted strings, one for each expense.
 */
function printAllExpenses() {
    return expenses.map(({ id, date, category, amount, description }) =>
        `#${id} | ${date} | ${category} | $${amount} | ${description}`
    );
}

// Jest tests
/**
 * Jest test suite for validating the expense management system.
 * Covers functionalities including adding, editing, deleting, and generating reports.
 */
describe('Expense Management System', () => {
    beforeEach(() => {
        expenses = [
            { id: 1, date: '2024-12-01', category: 'Food', amount: 20.5, description: 'Lunch' },
            { id: 2, date: '2024-12-03', category: 'Transport', amount: 15, description: 'Bus fare' },
            { id: 3, date: '2024-12-10', category: 'Shopping', amount: 150, description: 'Clothes' },
            { id: 4, date: '2024-12-15', category: 'Food', amount: 30, description: 'Dinner' },
        ];
    });

    test('should add a new expense', () => {
        addExpense('2024-12-20', 'Food', 25, 'Snacks');
        expect(expenses.length).toBe(5);
        expect(expenses[4]).toEqual({
            id: 5,
            date: '2024-12-20',
            category: 'Food',
            amount: 25,
            description: 'Snacks'
        });
    });

    test('should throw an error for invalid inputs when adding an expense', () => {
        expect(() => addExpense('', 'Food', 25, 'Snacks')).toThrow('Invalid input');
        expect(() => addExpense('2024-12-20', '', 25, 'Snacks')).toThrow('Invalid input');
        expect(() => addExpense('2024-12-20', 'Food', -25, 'Snacks')).toThrow('Invalid input');
        expect(() => addExpense('2024-12-20', 'Food', 25, '')).toThrow('Invalid input');
    });

    test('should edit an existing expense', () => {
        editExpense(1, { amount: 22, description: 'Brunch' });
        expect(expenses[0].amount).toBe(22);
        expect(expenses[0].description).toBe('Brunch');
    });

    test('should delete an existing expense', () => {
        deleteExpense(2);
        expect(expenses.length).toBe(3);
        expect(expenses.find(e => e.id === 2)).toBeUndefined();
    });

    test('should not delete a non-existing expense', () => {
        const initialLength = expenses.length;
        deleteExpense(100);
        expect(expenses.length).toBe(initialLength);
    });

    test('should generate category summary correctly', () => {
        expect(generateCategorySummary()).toEqual({
            Food: 50.5,
            Transport: 15,
            Shopping: 150,
        });
    });

    test('should generate monthly report correctly for December', () => {
        expect(generateMonthlyReport('2024-12')).toBe(215.5);
    });

    test('should return null for most expensive expense on an empty list', () => {
        expenses = [];
        expect(findMostExpensiveExpense()).toBeNull();
    });

    test('should find the most expensive expense correctly', () => {
        expect(findMostExpensiveExpense()).toEqual({
            id: 3,
            date: '2024-12-10',
            category: 'Shopping',
            amount: 150,
            description: 'Clothes',
        });
    });

    test('should print all expenses in the correct format', () => {
        const expectedOutput = [
            '#1 | 2024-12-01 | Food | $20.5 | Lunch',
            '#2 | 2024-12-03 | Transport | $15 | Bus fare',
            '#3 | 2024-12-10 | Shopping | $150 | Clothes',
            '#4 | 2024-12-15 | Food | $30 | Dinner',
        ];
        expect(printAllExpenses()).toEqual(expectedOutput);
    });
});
