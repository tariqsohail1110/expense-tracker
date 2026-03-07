import bcrypt from 'bcrypt';

export class HashingService {
    async hashPassword(password, saltOrRounds = 10) {
        return bcrypt.hashSync(password, saltOrRounds);
    }
}