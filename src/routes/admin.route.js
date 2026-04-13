import { Router } from "express";
import { AdminController } from "../modules/admin/controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth/auth.middleware.js";
import { hasAllPermissions } from "../middlewares/permission/permission.middleware.js";
import { Permissions } from "../common/enums/enums.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateCreateAdminDto } from '../middlewares/admin/validate-create-admin-dto.middleware.js'
import { validateUpdateAdminDto } from '../middlewares/admin/validate-update-admin-dto.middleware.js'

const router = Router();
const adminController = new AdminController();

router.post('/', authMiddleware, hasAllPermissions(Permissions.MANAGE_ALL_ADMINS), validate(validateCreateAdminDto), adminController.createAdmin);
router.get('/', authMiddleware, hasAllPermissions(Permissions.MANAGE_ALL_ADMINS), adminController.getAllAdmins);
router.get('/email', authMiddleware, hasAllPermissions(Permissions.MANAGE_ALL_ADMINS), adminController.getAdminByEmail);
router.get('/:id', authMiddleware, hasAllPermissions(Permissions.MANAGE_ALL_ADMINS), adminController.getAdminById);
router.patch('/:id', authMiddleware, validate(validateUpdateAdminDto), adminController.updateAdmin);
router.patch('/role/:id', authMiddleware, hasAllPermissions(Permissions.MANAGE_ALL_ADMINS), validate);
router.delete('/:id', authMiddleware, hasAllPermissions(Permissions.MANAGE_ALL_ADMINS), adminController.deleteAdmin);

export default router;