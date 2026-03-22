import bcrypt from 'bcrypt';

export class HashingService {
    async hashPassword(password, saltOrRounds = 10) {
        return bcrypt.hash(password, saltOrRounds);
    }

    async comparePlainPass(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}