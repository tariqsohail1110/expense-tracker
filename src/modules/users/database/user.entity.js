export const User = {
    tableName: 'users',
    columns: {
        id: 'SERIAL PRIMARY KEY',
        name: 'VARCHAR(100) NOT NULL',
        email: 'VARCHAR(50) NOT NULL UNIQUE',
        password: 'TEXT NOT NULL',
        role: 'VARCHAR(20) DEFAULT \'user\' CHECK (role IN (\'super_admin\', \'admin\', \'user\'))',
        isActive: 'BOOLEAN DEFAULT FALSE NOT NULL',
        createdAT: 'TIMESTAMP DEFAULT NOW()'
    }
};

export const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(50) NOT NULL UNIQUE,
        password    TEXT NOT NULL,
        role        VARCHAR(20) DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'user')),
        is_active   BOOLEAN DEFAULT FALSE NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW()
    );
`