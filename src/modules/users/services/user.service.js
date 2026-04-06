import { UserRepository } from "../repositories/user.repository.js";
import { validateIntegerValues } from "../../../common/errors/validate-integer values.error.js";
import { notExists, notFound } from "../../../common/errors/not-exist.error.js";
import { HashingService } from "../../../common/hashingService/hashing.service.js";

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
        this.hashingService = new HashingService();
    }

    async getAll() {
        const users = await this.userRepository.getAll();
        return users;
    }

    async getById(id) {
        const parseId = Number(id);
        validateIntegerValues(parseId, 'user ID');
        const user = await this.userRepository.getById(parseId);
        return notExists(user, "User");
    }

    async getByEmail(email) {
        const user = await this.userRepository.getByEmail(email);
        return notExists(user, "User");
    }

    async createUser(data) {
        const { name, email, password } = data;
        const existingUser = await this.userRepository.getByEmail(email);
        if(existingUser) {
            throw new Error("Email Already Exists");
        }
        const hashedPass = await this.hashingService.hashPassword(password);
        const user = await this.userRepository.create({
            name,
            email,
            password: hashedPass,
        });
        const { password: _, is_active, ...userWithoutPass} = user;
        return userWithoutPass;
    }

    async update(id, data) {
        const parseId = Number(id);
        validateIntegerValues(parseId, "User ID");
        const user = await this.userRepository.getById(parseId);
        notFound(user, "User");
        if(data.password) {
            data.password = await this.hashingService.hashPassword(data.password);
        }
        const updatedUser = await this.userRepository.update(parseId, data);
        const { password: _, ...userWithoutPass } = updatedUser;
        return userWithoutPass;
    }

    async deleteUser(id) {
        const parseId = Number(id);
        validateIntegerValues(parseId, "User ID");
        const user = await this.userRepository.getById(parseId);
        notFound(user, "User");
        await this.userRepository.delete(parseId);
    }

    async activateUser(id) {
        try {
            return await this.userRepository.activateUser(id);
        }catch(error) {
            throw error;
        }
    }

    async updatePassword(id, password) {
        try {
            const hashedPass = await this.hashingService.hashPassword(password);
            await this.userRepository.updatePassword(id, hashedPass);
            return { message: 'Password updated successfully' };
        }catch(error) {
            throw error;
        }
    }
}