export const Expense = {
    tableName: 'expenses',
    columns: {
        id: 'SERIAL PRIMARY KEY',
        user_id: 'INTEGER REFRENCES users(id) ON DELETE CASCADE',
        title: 'VARCHAR(150) NOT NULL',
        amount: 'NUMERIC(10, 2) NOT NULL',
        category: `VARCHAR(50) CHECK (category IN
            ('Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Bills', 'Others'))`,
        date: 'DATE NOT NULL',
        createdAt: 'TIMESTAMP DEFUALT NOW()',
    }
};

export const createExpenseTable = `
    CREATE TABLE IF NOT EXISTS expenses (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER REFERENCES user(id) ON DELETE CASCADE,
        title      VARCHAR(150) NOT NULL,
        amount     NUMERIC(10, 2) NOT NULL,
        category   VARCHAR(50) CHECK (category IN
                    ('Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Bills, 'Others')),
        date       DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );
`