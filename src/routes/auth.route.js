import { Router } from "express";
import { AuthenticationController } from "../modules/auth/controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { valiateLoginRequestDto } from "../middlewares/auth/validate-login-request.dto.js";

const router = Router();
const authenticationController = new AuthenticationController();

router.post('/', validate(valiateLoginRequestDto), authenticationController.logIn);
router.post('/refresh', authenticationController.refresh);

export default router;