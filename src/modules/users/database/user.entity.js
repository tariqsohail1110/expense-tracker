export const User = {
    tableName: 'users',
    columns: {
        id: 'SERIAL PRIMARY KEY',
        first_name: 'VARCHAR(100) NOT NULL',
        last_name: 'VARCHAR(100) NOT NULL',
        email: 'VARCHAR(50) NOT NULL UNIQUE',
        password: 'TEXT NULL',
        google_id: 'VARCHAR(255) UNIQUE',
        role: 'VARCHAR(20) DEFAULT \'user\' CHECK (role IN (\'admin\', \'user\'))',
        isActive: 'BOOLEAN DEFAULT FALSE NOT NULL',
        createdAT: 'TIMESTAMP DEFAULT NOW()',
        token_version: 'INT DEFAULT 1 NOT NULL'
    }
};

export const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id              SERIAL PRIMARY KEY,
        first_name      VARCHAR(100) NOT NULL,
        last_name       VARCHAR(100) NOT NULL,
        email           VARCHAR(50) NOT NULL UNIQUE,
        password        TEXT,
        google_id       VARCHAR(255) UNIQUE,
        role            VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        is_active       BOOLEAN DEFAULT FALSE NOT NULL,
        created_at      TIMESTAMP DEFAULT NOW(),
        token_version   INT DEFAULT 1 NOT NULL
    );
`