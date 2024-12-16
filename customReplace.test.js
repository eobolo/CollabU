let expenses = [
    { id: 1, date: '2024-12-01', category: 'Food', amount: 20.5, description: 'Lunch' },
    { id: 2, date: '2024-12-03', category: 'Transport', amount: 15, description: 'Bus fare' },
    { id: 3, date: '2024-12-10', category: 'Shopping', amount: 150, description: 'Clothes' },
    { id: 4, date: '2024-12-15', category: 'Food', amount: 30, description: 'Dinner' },
];

const generateId = () => Math.max(0, ...expenses.map((expense) => expense.id)) + 1;

function addExpense(date, category, amount, description) {
    const id = generateId();
    if (isValidExpense(date, category, amount, description)) {
        expenses.push({ id, date, category, amount, description });
    }
}

function editExpense(id, updates) {
    const expense = expenses.find((expense) => expense.id === id);
    if (!expense) return;
    if (isValidExpense(updates.date, updates.category, updates.amount, updates.description)) {
        Object.assign(expense, updates);
    }
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
};
function isValidDate(date) {
    // Simple validation to check if the date is in the correct format
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isValidAmount(amount) {
    return Number.isFinite(amount) && amount >= 0;
}

function isValidExpense(date, category, amount, description) {
    return isValidDate(date) && isValidAmount(amount) && category.trim() !== '' && description.trim() !== '';
}

describe('Expense Management System', () => {
    describe('addExpense', () => {
        test('should add a valid expense', () => {
            addExpense('2024-12-20', 'Food', 25, 'Groceries');
            expect(expenses.length).toBe(5);
            expect(expenses[4].category).toBe('Food');
        });

        test('should not add an expense with a negative amount', () => {
            addExpense('2024-12-20', 'Food', -10, 'Groceries');
            expect(expenses.length).toBe(5);
        });

        test('should not add an expense with an empty category', () => {
            addExpense('2024-12-20', '', 25, 'Groceries');
            expect(expenses.length).toBe(5);
        });
    });

    describe('editExpense', () => {
        test('should edit a valid expense', () => {
            editExpense(3, { description: 'Winter clothes' });
            expect(expenses[2].description).toBe('Winter clothes');
        });

        test('should not edit an expense with a non-existent ID', () => {
            editExpense(100, { description: 'Winter clothes' });
            expect(expenses[2].description).toBe('Clothes');
        });

        test('should not edit an expense with a negative amount', () => {
            editExpense(3, { amount: -50 });
            expect(expenses[2].amount).toBe(150);
        });
    });

    describe('deleteExpense', () => {
        test('should delete an expense', () => {
            deleteExpense(2);
            expect(expenses.find((expense) => expense.id === 2)).toBeUndefined();
        });

        test('should not delete an expense with a non-existent ID', () => {
            deleteExpense(100);
            expect(expenses.length).toBe(4);
        });
    });

    describe('generateCategorySummary', () => {
        test('should summarize expenses by category', () => {
            const summary = generateCategorySummary();
            expect(summary.Food).toBe(50.5);
            expect(summary.Shopping).toBe(150);
        });
    });

    describe('generateMonthlyReport', () => {
        test('should generate a monthly report', () => {
            const report = generateMonthlyReport('2024-12');
            expect(report).toBe(215.5);
        });

        test('should generate a report for an empty month', () => {
            const report = generateMonthlyReport('2025-01');
            expect(report).toBe(0);
        });
    });

    describe('findMostExpensiveExpense', () => {
        test('should find the most expensive expense', () => {
            const mostExpensive = findMostExpensiveExpense();
            expect(mostExpensive.id).toBe(3);
            expect(mostExpensive.amount).toBe(150);
        });

        test('should return null for an empty expense list', () => {
            expenses = [];
            const mostExpensive = findMostExpensiveExpense();
            expect(mostExpensive).toBeNull();
        });
    });

    describe('printAllExpenses', () => {
        test('should print all expenses', () => {
            const allExpenses = printAllExpenses();
            expect(allExpenses.length).toBe(4);
            expect(allExpenses[0]).toBe('#1 | 2024-12-01 | Food | $20.5 | Lunch');
        });
    });
});
