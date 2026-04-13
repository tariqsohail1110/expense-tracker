import { Router } from "express";
import { UserController } from "../modules/users/controllers/user.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateCreateUserDto } from "../middlewares/users/validate-create-user-dto.middleware.js";
import { validateUpdateUserDto } from "../middlewares/users/validate-update-user-dto.middleware.js";
import { authMiddleware } from "../middlewares/auth/auth.middleware.js";
import { hasAnyPermission } from "../middlewares/permission/permission.middleware.js";
import { Permissions } from "../common/enums/enums.js";

const router = Router();
const userController = new UserController();

// user routes (static always first)
router.get('/me', authMiddleware, hasAnyPermission(Permissions.GET_OWN_PROFILE), userController.getMe)
router.patch('/me', authMiddleware, validate(validateUpdateUserDto), hasAnyPermission(Permissions.UPDATE_OWN_PROFILE), userController.updateMe)
router.delete('/me', authMiddleware, hasAnyPermission(Permissions.DELETE_OWN_PROFILE), userController.deleteMe)

// admin routes (dynamic last)
router.post('/', authMiddleware, hasAnyPermission(Permissions.CREATE_USER), validate(validateCreateUserDto), userController.createUser)
router.get('/', authMiddleware, hasAnyPermission(Permissions.READ_ALL_USERS), userController.getAllUsers)
router.get('/email', authMiddleware, hasAnyPermission(Permissions.GET_ANY_USER), userController.getByEmail)
router.get('/:id', authMiddleware, hasAnyPermission(Permissions.GET_ANY_USER), userController.getById)
router.patch('/:id', authMiddleware, validate(validateUpdateUserDto), hasAnyPermission(Permissions.UPDATE_ANY_USER), userController.updateUser)
router.delete('/:id', authMiddleware, hasAnyPermission(Permissions.DELETE_ANY_USER), userController.deleteUser)

export default router;