import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import userRouter from './routes/user.route.js';
import expenseRouter from './routes/expense.route.js';
import authenticationRouter from './routes/auth.route.js';
import adminRouter from './routes/admin.route.js'
import { initDB } from './config/db.config.js';
import bearerToken from 'express-bearer-token';
import { SuperAdminSeeder } from './modules/admin/seeder/admin.seeder.js';

dotenv.config();

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Expense Tracker API',
            version: '1.0.0',
        },
    },
    apis: ['./src/routes/*.js'],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions);



app.use(express.json());
app.use(bearerToken());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/users', userRouter);
app.use('/expenses', expenseRouter);
app.use('/auth', authenticationRouter);
app.use('/admin', adminRouter);

await initDB();

const seeder = new SuperAdminSeeder();
await seeder.seed();

app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API is running' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});