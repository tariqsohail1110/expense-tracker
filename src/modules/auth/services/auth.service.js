import { notFound } from "../../../common/errors/not-exist.error.js";
import { HashingService } from "../../../common/hashingService/hashing.service.js";
import { UserService } from "../../users/services/user.service.js";
import { JWTService } from "../../../common/jwtService/jwt.service.js";

export class AuthenticationService {
    constructor() {
        this.userService = new UserService();
        this.hashingService = new HashingService();
        this.jwtService = new JWTService();
    }

    async login(email, password) {
        try {
            const user = await this.userService.getByEmail(email);
            const isMatch = await this.hashingService.comparePlainPass(password, user.password);
            if(!isMatch || !user) {
                throw new Error("Invalid Credentials");
            }
            const accessToken = await this.jwtService.generateAccessToken(user.id, user.email);
            const refreshToken = await this.jwtService.generateRefreshToken(user.id, user.email);
            const { password: _, ...userWithoutPass } = user;
            return {
                user: userWithoutPass,
                accessToken,
                refreshToken,
            };
        }catch (error) {
            throw new error;
        }
    }
}