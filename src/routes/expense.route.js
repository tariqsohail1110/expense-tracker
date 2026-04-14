import { Router } from "express";
import { ExpenseController } from "../modules/expenses/controllers/expense.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateCreateExpenseDto } from '../middlewares/expenses/validate-create-expense-dto.middleware.js';
import { validateUpdateExpenseDto } from '../middlewares/expenses/validate-update-expense-dto.middleware.js';
import { authMiddleware } from "../middlewares/auth/auth.middleware.js";
import { hasAnyPermission } from "../middlewares/permission/permission.middleware.js";
import { Permissions } from "../common/enums/enums.js";

const router = Router();
const expenseController = new ExpenseController();

router.use(authMiddleware);
router.post('/', validate(validateCreateExpenseDto), hasAnyPermission(Permissions.MANAGE_OWN_EXPENSES), expenseController.createExpense);
router.get('/user/me', hasAnyPermission(Permissions.MANAGE_OWN_EXPENSES), expenseController.getAllOwnExpenses);
router.get('/me/:id', hasAnyPermission(Permissions.MANAGE_OWN_EXPENSES), expenseController.getOwnExpenseById)
router.put('/:id', validate(validateUpdateExpenseDto), hasAnyPermission(Permissions.MANAGE_OWN_EXPENSES), expenseController.updateExpense);
router.delete('/:id', hasAnyPermission(Permissions.MANAGE_OWN_EXPENSES), expenseController.deleteExpense);


export default router;