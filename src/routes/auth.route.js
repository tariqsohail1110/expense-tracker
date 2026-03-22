import { Router } from "express";
import { AuthenticationController } from "../modules/auth/controllers/auth.controller.js";

const router = Router();
const authenticationController = new AuthenticationController();

router.post('/', authenticationController.logIn)

export default router;