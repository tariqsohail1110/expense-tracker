import { Router } from "express";
import { ExpenseController } from "../modules/expenses/controllers/expense.controller.js";
import { authMiddleware } from "../middlewares/auth/auth.middleware.js";
import { hasAnyPermission } from "../middlewares/permission/permission.middleware.js";
import { Permissions } from "../common/enums/enums.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateCreateUserDto } from "../middlewares/users/validate-create-user-dto.middleware.js";
import { validateUpdateUserDto } from "../middlewares/users/validate-update-user-dto.middleware.js";
import { UserController } from "../modules/users/controllers/user.controller.js";

const router = Router();
const expenseController = new ExpenseController();
const userController = new UserController();

router.use(authMiddleware);

//user routes
router.post('/users', hasAnyPermission(Permissions.MANAGE_ANY_USER), validate(validateCreateUserDto), userController.createUser);
router.get('/users', hasAnyPermission(Permissions.MANAGE_ANY_USER), userController.getAllUsers);
router.get('/users/email', hasAnyPermission(Permissions.MANAGE_ANY_USER), userController.getByEmail);
router.get('/users/:id', hasAnyPermission(Permissions.MANAGE_ANY_USER), userController.getById);
router.patch('/users/:id', validate(validateUpdateUserDto), hasAnyPermission(Permissions.MANAGE_ANY_USER), userController.updateUser);
router.patch('/users/de_activate/:id', hasAnyPermission(Permissions.MANAGE_ANY_USER), userController.deactivateUser);
router.delete('/users/:id', hasAnyPermission(Permissions.MANAGE_ANY_USER), userController.deleteUser);

//expense routes
router.get('/expenses/:userId', hasAnyPermission(Permissions.READ_ALL_EXPENSES), expenseController.getAllExpenses);
router.get('/expenses/:id', hasAnyPermission(Permissions.READ_ALL_EXPENSES), expenseController.getExpenseById);

export default router;