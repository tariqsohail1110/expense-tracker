import { Router } from "express";
import { UserController } from "../modules/users/controllers/user.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateCreateUserDto } from "../middlewares/users/validate-create-user-dto.middleware.js";
import { validateUpdateUserDto } from "../middlewares/users/validate-update-user-dto.middleware.js";
import { authMiddleware } from "../middlewares/auth/auth.middleware.js";

const router = Router();
const userController = new UserController();

router.get('/', authMiddleware, userController.getAllUsers);
router.get('/email',authMiddleware, userController.getByEmail);
router.get('/:id',authMiddleware, userController.getById);
router.post('/', validate(validateCreateUserDto), userController.createUser);
router.put('/:id',authMiddleware, validate(validateUpdateUserDto), userController.updateUser);
router.delete('/:id',authMiddleware, userController.deleteUser);

export default router;