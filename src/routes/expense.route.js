import { Router } from "express";
import { ExpenseController } from "../modules/expenses/controllers/expense.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateCreateExpenseDto } from '../middlewares/expenses/validate-create-expense-dto.middleware.js';
import { validateUpdateExpenseDto } from '../middlewares/expenses/validate-update-expense-dto.middleware.js';
import { authMiddleware } from "../middlewares/auth/auth.middleware.js";

const router = Router();
const expenseController = new ExpenseController();

router.use(authMiddleware);
router.get('/user/:userId', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpenseById);
router.post('/', validate(validateCreateExpenseDto), expenseController.createExpense);
router.put('/:id', validate(validateUpdateExpenseDto), expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

export default router;