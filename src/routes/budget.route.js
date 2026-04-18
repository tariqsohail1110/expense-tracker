import { Router } from "express";
import { BudgetController } from "../modules/budget/controllers/budget.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateCreateBudgetDto } from '../middlewares/budget/validate-create-budget-dto.middleware.js'
import { validateUpdateBudgetDto } from '../middlewares/budget/validate-update-budget-dto.middleware.js'
import { authMiddleware } from "../middlewares/auth/auth.middleware.js";
import { hasRole } from "../middlewares/roles/check-role.middleware.js";
import { Roles } from "../common/enums/enums.js";

const router = Router();
const budgetController = new BudgetController();

router.use(authMiddleware);
router.use(hasRole(Roles.USER));

router.post('/', validate(validateCreateBudgetDto), budgetController.createBudget);
router.get('/me', budgetController.getBudgetByUserId);
router.patch('/me' , validate(validateUpdateBudgetDto), budgetController.updateMyBudget);
router.delete('/me', budgetController.deleteBudget);

export default router;