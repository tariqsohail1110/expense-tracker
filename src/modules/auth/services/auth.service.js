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
            notFound(user, "User");
            const isMatch = await this.hashingService.comparePlainPass(password, user.password);
            if(!isMatch) {
                throw new Error("Incorrect Password!");
            }
            const accessToken = await this.jwtService.generateAccessToken(user.id, user.email);
            const refreshToken = await this.jwtService.generateRefreshToken(user.id, user.email);
            const { password: _, created_at, ...userWithoutPass } = user;
            return {
                user: userWithoutPass,
                accessToken,
                refreshToken,
            };
        }catch (error) {
            throw new Error(error.message);
        }
    }
}