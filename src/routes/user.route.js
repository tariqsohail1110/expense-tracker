import { Router } from "express";
import { UserController } from "../modules/users/controllers/user.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateCreateUserDto } from "../middlewares/users/validate-create-user-dto.middleware.js";
import { validateUpdateUserDto } from "../middlewares/users/validate-update-user-dto.middleware.js";

const router = Router();
const userController = new UserController();

router.get('/', userController.getAllUsers);
router.get('/email', userController.getByEmail);
router.get('/:id', userController.getById);
router.post('/', validate(validateCreateUserDto), userController.createUser);
router.put('/:id', validate(validateUpdateUserDto), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;