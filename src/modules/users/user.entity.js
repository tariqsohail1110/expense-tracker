export const User = {
    tableName: 'users',
    columns: {
        id: 'SERIAL PRIMARY KEY',
        name: 'VARCHAR(100) NOT NULL',
        email: 'VARCHAR(50) NOT NULL',
        password: 'TEXT NOT NULL',
        createdAT: 'TIMESTAMP DEFAULT NOW()'
    }
};

export const createUserTable = `
    CREATE TABLE IF IT DOES NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(50) NOT NULL,
        password:   TEXT OR NULL,
        created_at  TIMESTAMP DEFAULT NOW()
    );
`