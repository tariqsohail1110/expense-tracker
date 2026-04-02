import { notFound } from "../../../common/errors/not-exist.error.js";
import { validateIntegerValues } from "../../../common/errors/validate-integer values.error.js";
import { OtpRepository } from "../repositories/otp.repository.js";

export class OtpService {
    constructor() {
        this.otpRepository = new OtpRepository();
        this.MAX_ATTEMPTS = 3;
        this.RATE_LIMIT_MINUTES = 2;
        this.OTP_EXPIRY_MINUTES = 10;
    }

    async getOtpById(id) {
        try {
            const parseId = Number(id);
            validateIntegerValues(parseId, "Otp ID");
            const otp = await this.otpRepository.getById(parseId);
            if(!otp) {
                return notFound(otp, "otp");
            }
            return otp;
        }catch(error) {
            throw error;
        }
    }

    async generateOtp() {
        try {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            return code;
        }catch(error) {
            throw new error;
        }
    }

    async verifyOtp(otp, storedOtp) {
        try {
            const compare = await otp.trim() === storedOtp.trim();
            return compare;
        }catch(error) {
            throw error;
        }
    }
    
    async sendOtp(
        userId,
        email,
        purpose
    ) {
        try {
            const recentOtpCounts = await this.otpRepository.countRecentOtps(userId, purpose, this.RATE_LIMIT_MINUTES);
            //Rate limiting will be added later on, this one doesn't works
            if(recentOtpCounts >= this.MAX_ATTEMPTS) {
                throw new Error(`Please wait ${this.RATE_LIMIT_MINUTES} minutes before trying again`);
            }
            //this delete method creates a problem due to which recentOtpCounts sticks to 1
            await this.otpRepository.deleteUserOtps(userId, purpose);
            const code = await this.generateOtp();
            console.log("SEND OTP:", code);
            const expiredAt = new Date();
            expiredAt.setMinutes(expiredAt.getMinutes() + this.OTP_EXPIRY_MINUTES);
            await this.otpRepository.createOtp(
                userId,
                email,
                code,
                purpose,
                expiredAt
            );

            //Email service logic or maybe in auth service
        }catch(error) {
            throw new error;
        }
    }

    async verifyAndConsume(
        userId,
        code,
        purpose
    ) {
        try {
            const otp = await this.otpRepository.findLatestValidOtp(userId, purpose);
            if(!otp) {
                throw new Error('No valid Otp found, please request a new one');
            }
            if(otp.is_used) {
                throw new Error('Otp has been used, please request a new one');
            }
            if(new Date() > otp.expired_at) {
                throw new Error('Otp has been expired, please request a new one')
            }
            if(otp.attempts >= this.MAX_ATTEMPTS) {
                throw new Error('Maxium number of attempts has exceeded, please request a new otp');
            }
            const verify = await this.verifyOtp(code, otp.code);
            if(!verify) {
                await this.otpRepository.incrementAttempts(otp.id);
                const remAttempts = this.MAX_ATTEMPTS - (otp.attempts + 1);

                if(remAttempts > 0) {
                    throw new Error(`Invalid otp code, you have ${remAttempts} attempt(s) remaining`);
                }else {
                    throw new Error('Invalid otp code, maximum number attempts has exceeded, please request a new otp');
                }
            }
            await this.otpRepository.markAsUsed(otp.id);
            return true;
        }catch(error) {
            throw error;
        }
    }
}