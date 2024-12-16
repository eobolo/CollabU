let expenses = [
    { id: 1, date: '2024-12-01', category: 'Food', amount: 20.5, description: 'Lunch' },
    { id: 2, date: '2024-12-03', category: 'Transport', amount: 15, description: 'Bus fare' },
    { id: 3, date: '2024-12-10', category: 'Shopping', amount: 150, description: 'Clothes' },
    { id: 4, date: '2024-12-15', category: 'Food', amount: 30, description: 'Dinner' },
];

const generateId = () => Math.max(0, ...expenses.map((expense) => expense.id)) + 1;

function addExpense(date, category, amount, description) {
    if (amount < 0 || !date || !category || !description) {
        throw new Error('Invalid input');
    }
    const id = generateId();
    expenses.push({ id, date, category, amount, description });
}

function editExpense(id, updates) {
    const expense = expenses.find((expense) => expense.id === id);
    if (!expense) return;
    Object.assign(expense, updates);
}

function deleteExpense(id) {
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index === -1) return;
    expenses.splice(index, 1);
}

function generateCategorySummary() {
    const summary = {};
    expenses.forEach((expense) => {
        if (!summary[expense.category]) summary[expense.category] = 0;
        summary[expense.category] += expense.amount;
    });
    return summary;
}

function generateMonthlyReport(month) {
    const monthlyExpenses = expenses.filter((expense) => expense.date.startsWith(month));
    const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return total;
}

function findMostExpensiveExpense() {
    if (expenses.length === 0) return null;
    const maxExpense = expenses.reduce((max, expense) => (expense.amount > max.amount ? expense : max));
    return maxExpense;
}

function printAllExpenses() {
    return expenses.map(({ id, date, category, amount, description }) =>
        `#${id} | ${date} | ${category} | $${amount} | ${description}`
    );
}

// Jest tests
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
        expect(generateMonthlyReport('2024-12')).toBe(185.5);
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
