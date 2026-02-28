import pg from 'pg';
import dotenv from 'dotenv';
// import { Create }

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});



pool.connect(err => {
    if(err) {
        console.log('AN error occured', err.stack);
    }console.log('Database connected successfully');
})

export default pool;