import { AuthenticationService } from "../services/auth.service.js";

export class AuthenticationController {
    constructor() {
        this.authenticationService = new AuthenticationService();
        this.logIn = this.logIn.bind(this);
    }

    logIn = async (req, res) => {
        try { 
            const data = req.body;
            const login = await this.authenticationService.login(data.email, data.password);
            res.status(200).json({ data: login });
        }catch(error) {
            res.status(400).json({ message: error.message });
        }
    }
}