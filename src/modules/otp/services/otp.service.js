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
            throw new Error;
        }
    }

    async generateOtp() {
        try {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(code);
            return code;
        }catch(error) {
            throw new Error;
        }
    }

    async verifyOtp(otp, storedOtp) {
        try {
            const compare = otp.trim() === storedOtp;
            console.log(compare);
            return compare;
        }catch(error) {
            throw new Error;
        }
    }
    
    async sendOtp(
        userId,
        email,
        purpose
    ) {
        try {
            const recentOtpCounts = await this.otpRepository.countRecentOtps(userId, purpose, this.RATE_LIMIT_MINUTES);
            if(recentOtpCounts > 0) {
                throw new Error(`Please wait ${this.RATE_LIMIT_MINUTES} before trying again`);
            }
            await this.otpRepository.deleteUserOtps(userId, purpose);
            const code = this.generateOtp();
            await this.otpRepository.createOtp(
                userId,
                email,
                code,
                purpose,
                this.OTP_EXPIRY_MINUTES
            );
            console.log('Otp sent');

            //Email service logic or maybe in auth service
        }catch(error) {
            throw new Error;
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
            if(otp.isUsed) {
                throw new Error('Otp has been used, please request a new one');
            }
            if(new Date() > otp.expiredAt) {
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
            console.log('Otp verified');
            return true;
        }catch(error) {
            throw new Error;
        }
    }
}