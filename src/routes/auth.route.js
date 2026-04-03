import { Router } from "express";
import { AuthenticationController } from "../modules/auth/controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateLoginRequestDto } from "../middlewares/auth/validate-login-request-dto.middleware.js";
import { validateRefreshTokenDto } from "../middlewares/auth/validate-refresh-token-dto.middleware.js";
import { validateVerifyOtpDto } from "../middlewares/auth/validate-verifyotp-middleware.js";
import { validateRegisterUserDto } from "../middlewares/auth/validate-register-user.dto.js";

const router = Router();
const authenticationController = new AuthenticationController();

router.post('/register', validate(validateRegisterUserDto), authenticationController.register);
router.post('/login', validate(validateLoginRequestDto), authenticationController.logIn);
router.post('/verify', validate(validateVerifyOtpDto), authenticationController.verify);
router.post('/refresh', validate(validateRefreshTokenDto), authenticationController.refresh);

export default router;