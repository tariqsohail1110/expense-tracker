import { Router } from "express";
import { UserController } from "../modules/users/controllers/user.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateUpdateUserDto } from "../middlewares/users/validate-update-user-dto.middleware.js";
import { authMiddleware } from "../middlewares/auth/auth.middleware.js";
import { Roles } from "../common/enums/enums.js";
import { hasRole } from '../middlewares/roles/check-role.middleware.js'

const router = Router();
const userController = new UserController();

router.use(authMiddleware);
router.use(hasRole(Roles.USER));

router.get('/me', authMiddleware, userController.getMe)
router.patch('/me', authMiddleware, validate(validateUpdateUserDto), userController.updateMe)
router.delete('/me', authMiddleware, userController.deleteMe)

export default router;