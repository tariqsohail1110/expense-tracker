export const Expense = {
    tableName: 'expenses',
    columns: {
        id: 'SERIAL PRIMARY KEY',
        user_id: 'INTEGER REFRENCES users(id) ON DELETE CASCADE',
        title: 'VARCHAR(150) NOT NULL',
        amount: 'NUMERIC(10, 2) NOT NULL',
        category: `VARCHAR(50) CHECK (category IN
            ('Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Bills', 'Others'))`,
        date: 'VARCHAR(20) NOT NULL',
        note: 'VARCHAR(300)',
        createdAt: 'TIMESTAMP DEFUALT NOW()',
    }
};

export const createExpenseTable = `
    CREATE TABLE IF NOT EXISTS expenses (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title      VARCHAR(150) NOT NULL,
        amount     NUMERIC(10, 2) NOT NULL,
        category   VARCHAR(50) CHECK (category IN
                    ('Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Bills', 'Others')),
        date       VARCHAR(20) NOT NULL,
        note       VARCHAR(300),
        created_at TIMESTAMP DEFAULT NOW()
    );
`