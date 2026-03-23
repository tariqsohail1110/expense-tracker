import { AuthenticationService } from "../services/auth.service.js";

export class AuthenticationController {
    constructor() {
        this.authenticationService = new AuthenticationService();
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

    refresh = async (req, res) => {
        try {
            const { refreshToken } = req.body;
            const refresh = await this.authenticationService.generateNewAccessToken(refreshToken);
            res.status(200).json({ data: refresh });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }
}