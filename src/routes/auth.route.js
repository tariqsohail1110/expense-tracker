import { Router } from "express";
import { AuthenticationController } from "../modules/auth/controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { validateLoginRequestDto } from "../middlewares/auth/validate-login-request-dto.middleware.js";
import { validateRefreshTokenDto } from "../middlewares/auth/validate-refresh-token-dto.middleware.js";
import { validateVerifyOtpDto } from "../middlewares/auth/validate-verifyotp-middleware.js";
import { validateRegisterUserDto } from "../middlewares/auth/validate-register-user.dto.js";
import { validateForgetPasswordDto } from "../middlewares/auth/validate-forget-password-dto.middleware.js";
import { validateResetPasswordDto } from "../middlewares/auth/validate-reset-password.dto.js";
import passport from "../config/passport.js";
import { JWTService } from "../common/jwtService/jwt.service.js";

const router = Router();
const authenticationController = new AuthenticationController();
const jwtService = new JWTService();
const FRONTEND_URL = new URL(process.env.CORS_ORIGIN || 'http://localhost:5173').origin;

router.post('/register', validate(validateRegisterUserDto), authenticationController.register);
router.post('/login', validate(validateLoginRequestDto), authenticationController.logIn);
router.post('/verify', validate(validateVerifyOtpDto), authenticationController.verify);
router.post('/refresh', validate(validateRefreshTokenDto), authenticationController.refresh);
router.post('/forget', validate(validateForgetPasswordDto),  authenticationController.forget);
router.post('/verifyotp', validate(validateVerifyOtpDto), authenticationController.verifyOtpforReset);
router.post('/reset', validate(validateResetPasswordDto),  authenticationController.resetPass);

// Google OAuth Routes
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get(
        '/google/callback',
        passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/?  error=google_auth_failed`,
        session: false
    }),
    async (req, res) => {
        try {
            const user = req.user;

            const accessToken = await jwtService.generateAccessToken(user.id, user.email, user.role);
            const refreshToken = await jwtService.generateRefreshToken(user.id, user.email, user.role, user.token_version || 1);

            return res.redirect(
                `${FRONTEND_URL}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
            );
        } catch(error) {
            return res.redirect(`${FRONTEND_URL}/?error=token_generation_failed`)
        }
    }
);

export default router;