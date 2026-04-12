import { Router } from "express";
import { ExpenseController } from "../modules/expenses/controllers/expense.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateCreateExpenseDto } from '../middlewares/expenses/validate-create-expense-dto.middleware.js';
import { validateUpdateExpenseDto } from '../middlewares/expenses/validate-update-expense-dto.middleware.js';
import { authMiddleware } from "../middlewares/auth/auth.middleware.js";
import { hasPermissions } from "../middlewares/permission/permission.middleware.js";
import { Permissions } from "../common/enums/enums.js";

const router = Router();
const expenseController = new ExpenseController();

router.use(authMiddleware);
router.get('/user/:userId', hasPermissions(Permissions.READ_ALL_EXPENSES, Permissions.MANAGE_OWN_EXPENSES), expenseController.getAllExpenses);
router.get('/:id', hasPermissions(Permissions.READ_ALL_EXPENSES), hasPermissions(Permissions.MANAGE_OWN_EXPENSES), expenseController.getExpenseById);
router.post('/', validate(validateCreateExpenseDto), hasPermissions(Permissions.MANAGE_OWN_EXPENSES), expenseController.createExpense);
router.put('/:id', validate(validateUpdateExpenseDto), hasPermissions(Permissions.MANAGE_OWN_EXPENSES), expenseController.updateExpense);
router.delete('/:id', hasPermissions(Permissions.MANAGE_OWN_EXPENSES), expenseController.deleteExpense);

export default router;