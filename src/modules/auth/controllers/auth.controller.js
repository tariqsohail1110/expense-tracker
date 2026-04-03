import { AuthenticationService } from "../services/auth.service.js";

export class AuthenticationController {
    constructor() {
        this.authenticationService = new AuthenticationService();
    }

    register = async (req, res) => {
        try {
            const data = req.body;
            const register = await this.authenticationService.registerUser(data.name, data.email, data.password, data.confirmPass);
            res.status(200).json({ data: register });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 401;
            res.status(statusCode).json({ message: error.message });
        }
    }

    logIn = async (req, res) => {
        try { 
            const data = req.body;
            const login = await this.authenticationService.login(data.email, data.password);
            res.status(200).json({ data: login });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 401;
            res.status(statusCode).json({ message: error.message });
        }
    }

    verify = async (req,res) => {
        try {
            const data = req.body;
            const verify = await this.authenticationService.verifyUser(data.email, data.code);
            res.status(200).json({ data: verify });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 401;
            res.status(statusCode).json({ message: error.message });
        }
    }

    refresh = async (req, res) => {
        try {
            const { refreshToken } = req.body;
            const refresh = await this.authenticationService.generateNewAccessToken(refreshToken);
            const { newAccessToken, ...rest } = typeof refresh === "object" && refresh !== null ? refresh : { };
            const normalizedRefresh = newAccessToken !== undefined
            ? { accessToken : newAccessToken, ...rest }
            : refresh;
            res.status(200).json({ data: normalizedRefresh });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }
}