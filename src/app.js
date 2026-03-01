import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.config.js';

dotenv.config();

const app = express();

app.use(express.json());

initDB();

app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API is running' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});