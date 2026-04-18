export const Budget = {
    columns: {
        id: 'SERIAL PRIMARY KEY',
        user_id: 'INTEGER REFERENCES users(id) ON DELETE CASCADE',
        totalBudget: 'NUMERIC(10, 2) DEFAULT 0 NOT NULL UNIQUE',
        remainingBudget: 'NUMERIC(10, 2) DEFAULT 0 NOT NULL UNIQUE',
        createdAt: 'TIMESTAMP DEFAULT NOW()',
        updatedAt: 'DATE DEFAULT NOW()',
    }
};

export const createBudgetTable = `
    CREATE TABLE IF NOT EXISTS budgets (
        id              SERIAL PRIMARY KEY,
        user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_budget     NUMERIC(10, 2) DEFAULT 0 NOT NULL,
        remaining_budget NUMERIC(10, 2) DEFAULT 0 NOT NULL,
        created_at      TIMESTAMP DEFAULT NOW(),
        updated_at      TIMESTAMP DEFAULT NOW()
    );
`