import { Router } from "express";
import { UserController } from "../modules/users/controllers/user.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateCreateUserDto } from "../middlewares/users/validate-create-user-dto.middleware.js";
import { validateUpdateUserDto } from "../middlewares/users/validate-update-user-dto.middleware.js";
import { authMiddleware } from "../middlewares/auth/auth.middleware.js";
import { hasPermissions } from "../middlewares/permission/permission.middleware.js";
import { Permissions } from "../common/enums/enums.js";

const router = Router();
const userController = new UserController();

// public
router.post('/', validate(validateCreateUserDto), userController.createUser)

// user routes (static always first)
router.get('/me', authMiddleware, hasPermissions(Permissions.GET_OWN_PROFILE), userController.getMe)
router.patch('/me', authMiddleware, validate(validateUpdateUserDto), hasPermissions(Permissions.UPDATE_OWN_PROFILE), userController.updateMe)
router.delete('/me', authMiddleware, hasPermissions(Permissions.DELETE_OWN_PROFILE), userController.deleteMe)

// admin routes (dymanic last)
router.get('/', authMiddleware, hasPermissions(Permissions.READ_ALL_USERS), userController.getAllUsers)
router.get('/email', authMiddleware, hasPermissions(Permissions.GET_ANY_USER), userController.getByEmail)
router.get('/:id', authMiddleware, hasPermissions(Permissions.GET_ANY_USER), userController.getById)
router.patch('/:id', authMiddleware, validate(validateUpdateUserDto), hasPermissions(Permissions.UPDATE_ANY_USER), userController.updateUser)
router.delete('/:id', authMiddleware, hasPermissions(Permissions.DELETE_ANY_USER), userController.deleteUser)

export default router;