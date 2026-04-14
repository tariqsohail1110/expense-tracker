import { Router } from "express";
import { ExpenseController } from "../modules/expenses/controllers/expense.controller.js";
import { authMiddleware } from "../middlewares/auth/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateCreateUserDto } from "../middlewares/users/validate-create-user-dto.middleware.js";
import { validateUpdateUserDto } from "../middlewares/users/validate-update-user-dto.middleware.js";
import { UserController } from "../modules/users/controllers/user.controller.js";
import { Roles } from "../common/enums/enums.js";
import { hasRole } from '../middlewares/roles/check-role.middleware.js'

const router = Router();
const expenseController = new ExpenseController();
const userController = new UserController();

router.use(authMiddleware);
router.use(hasRole(Roles.ADMIN));

//user routes
router.post('/users', validate(validateCreateUserDto), userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/email', userController.getByEmail);
router.get('/users/:id', userController.getById);
router.patch('/users/:id', validate(validateUpdateUserDto), userController.updateUser);
router.patch('/users/:id/deactivate', userController.deactivateUser);
router.delete('/users/:id', userController.deleteUser);

//expense routes
router.get('/expensesall/:userId', expenseController.getExpensesByUserId);
router.get('/expenses/:id', expenseController.getExpenseByUserId);

export default router;