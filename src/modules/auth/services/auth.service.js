import { HashingService } from "../../../common/hashingService/hashing.service.js";
import { UserService } from "../../users/services/user.service.js";
import { JWTService } from "../../../common/jwtService/jwt.service.js";
import { OtpService } from "../../otp/services/otp.service.js";
import { OtpPurpose } from "../../../common/enums/enums.js";

export class AuthenticationService {
    constructor() {
        this.userService = new UserService();
        this.hashingService = new HashingService();
        this.jwtService = new JWTService();
        this.otpService = new OtpService();
    }

    async registerUser(name, email, password, confirmPass) {
        try{
            const data = { name, email, password };
            const register = await this.userService.createUser(data);
            return register;
        }catch(error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            const user = await this.userService.getByEmail(email);
            const isMatch = await this.hashingService.comparePlainPass(password, user.password);
            if(!isMatch || !user) {
                throw new Error("Invalid Credentials");
            }
            // console.log("User", user);
            await this.otpService.sendOtp(
                user.id,
                user.email,
                OtpPurpose.LOGIN,
            );
            return "Otp sent successfully to your email";
        }catch (error) {
            throw error;
        }
    }

    async verifyUser(email, code) {
        try{
            const user =  await this.userService.getByEmail(email);
            const verifiedOtp = await this.otpService.verifyAndConsume(
                user.id,
                code,
                OtpPurpose.LOGIN
            );
            if(!user || !verifiedOtp) {
                throw new Error("Invalid, please try again");
            }
            const accessToken = await this.jwtService.generateAccessToken(user.id, user.email);
            const refreshToken = await this.jwtService.generateRefreshToken(user.id, user.email);
            const { password: _, is_active, ...userWithoutPass } = user;
            if(user.is_active === false) {
                await this.userService.activateUser(user.id);
            }
            return {
                user: userWithoutPass,
                accessToken,
                refreshToken,
            };
        }catch(error) {
            throw error;
        }
    }

    async generateNewAccessToken(refreshToken) {
        try{
            return await this.jwtService.generateNewAccessToken(refreshToken);
        }catch(error) {
            throw error;
        }
    }
}