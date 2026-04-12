import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

export class JWTService {
    readPrivateKey = () => {
        return fs.readFileSync(join(__dirname, '../../keys/private_key.pem'), 'utf8');
    }

    readPublicKey = () => {
        return fs.readFileSync(join(__dirname, '../../keys/public_key.pem'), 'utf8');
    }

    async generateAccessToken(id, email, role) {
        try {
            const payload = {
                sub: id,
                email: email,
                role: role,
                type: 'access'
            }
            const secret = this.readPrivateKey();

            return jwt.sign(payload, secret, {
                algorithm: 'RS256',
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
            });

        }catch(error) {
            throw error;
        }
    }

    async generateRefreshToken(id, email, role) {
        try {
            const payload = {
                sub: id,
                email: email,
                role: role,
                type: 'refresh'
            }
            const secret = this.readPrivateKey();

            return jwt.sign(payload, secret, {
                algorithm: 'RS256',
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
            });
        }catch(error) {
            throw error;
        }
    }

    async generateNewAccessToken(refreshToken) {
        try {
            const key = this.readPublicKey();
            const payload = jwt.verify(refreshToken, key);
            if(payload.type !== 'refresh') {
                throw new Error('Invalid token type');
            }
            const newAccessToken = await this.generateAccessToken(
                payload.sub,
                payload.email,
                payload.role,
            )
            return {
                accessToken: newAccessToken
            };
        }catch(error) {
            throw error;
        }
    }

        async generateResetToken(id, email, role) {
        try {
            const payload = {
                sub: id,
                email: email,
                role: role,
                type: 'reset'
            }
            const secret = this.readPrivateKey();

            return jwt.sign(payload, secret, {
                algorithm: 'RS256',
                expiresIn: process.env.JWT_RESET_EXPIRES_IN
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