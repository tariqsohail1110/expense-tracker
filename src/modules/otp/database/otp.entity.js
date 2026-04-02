export const Otp = {
    columns: {
        id: 'SERIAL PRIMARY KEY',
        user_id: 'INTEGER REFERENCES users(id) ON DELETE CASCADE',
        code: 'VARCHAR(6) NOT NULL',
        purpose: 'VARCHAR(55) NOT NULL',
        email: 'VARCHAR(150) NOT NULL',
        createdAt: 'TIMESTAMP DEFAULT NOW()',
        expiredAt: 'TIMESTAMP NOT NULL',
        isUsed: 'BOOLEAN DEFAULT FALSE NOT NULL',
        attempts: 'INTEGER DEFUALT 0 NOT NULL',
    }
};

export const createOtpTable = `
    CREATE TABLE IF NOT EXISTS otps (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
        code        VARCHAR(6) NOT NULL,
        purpose     VARCHAR(55) NOT NULL,
        email       VARCHAR(150) NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW(),
        expired_at  TIMESTAMP NOT NULL,
        isUsed      BOOLEAN DEFAULT FALSE NOT NULL,
        attempts    INTEGER DEFAULT 0 NOT NULL 
    );
`