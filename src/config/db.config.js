import pg from 'pg';
import dotenv from 'dotenv';
import { createUserTable } from '../modules/users/database/user.entity.js'
import { createExpenseTable } from '../modules/expenses/database/expense.entity.js';
import { createOtpTable } from '../modules/otp/database/otp.entity.js';
import { createBudgetTable } from '../modules/budget/database/budget.entity.js';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export const initDB = async () => {
    await pool.query(createUserTable);
    await pool.query(createExpenseTable);
    await pool.query(createOtpTable);
    await pool.query(createBudgetTable);
    console.log('Tables Initialized');
}

pool.connect(err => {
    if(err) {
        console.log('AN error occured', err.stack);
    }console.log('Database connected successfully');
});

export default pool;


export const withTransaction = async (callback) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    }catch(error) {
        await client.query('ROLLBACK');
        throw error;
    }finally{
        client.release();
    }
}