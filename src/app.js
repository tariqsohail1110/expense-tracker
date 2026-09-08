import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import expenseRouter from './routes/expense.route.js';
import authenticationRouter from './routes/auth.route.js';
import adminRouter from './routes/admin.route.js';
import budgetRouter from './routes/budget.route.js';
import { initDB } from './config/db.config.js';
import bearerToken from 'express-bearer-token';
import { AdminSeeder } from './modules/admin/seeder/admin.seeder.js';
import cors from 'cors';
import passport from './config/passport.js';

dotenv.config();

const app = express();


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(bearerToken());
app.use(passport.initialize());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/expenses', expenseRouter);
app.use('/api/v1/auth', authenticationRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/budget', budgetRouter);

await initDB();

const seeder = new AdminSeeder();
await seeder.seed();

app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API is running' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});