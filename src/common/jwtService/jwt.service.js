import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export class JWTService {
    async generateAccessToken(id, email) {
        try {
            const payload = {
                sub: id,
                email: email,
                type: 'access'
            }
            const secret = process.env.JWT_ACCESS_SECRET;

            return jwt.sign(payload, secret, {
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
            });

        }catch(error) {
            throw error;
        }
    }

    async generateRefreshToken(id, email) {
        try {
            const payload = {
                sub: id,
                email: email,
                type: 'refresh'
            }
            const secret = process.env.JWT_REFRESH_SECRET;

            return jwt.sign(payload, secret, {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
            });
        }catch(error) {
            throw error;
        }
    }
}

// const jwtService = new JWTService();
// const accessToken = await jwtService.generateAccessToken(1, 'me@mail.com');
// const refreshToken = await jwtService.generateRefreshToken(1, 'me@mail.com');
// console.log("Access Token: ", accessToken);
// console.log("Refresh Token: ", refreshToken);