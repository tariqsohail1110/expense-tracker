import { Router } from "express";
import { AuthenticationController } from "../modules/auth/controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateLoginRequestDto } from "../middlewares/auth/validate-login-request-dto.middleware.js";
import { validateRefreshTokenDto } from "../middlewares/auth/validate-refresh-token-dto.middleware.js";

const router = Router();
const authenticationController = new AuthenticationController();

router.post('/', validate(validateLoginRequestDto), authenticationController.logIn);
router.post('/refresh', validate(validateRefreshTokenDto), authenticationController.refresh);

export default router;