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
        const { name, email, password, } = data;
        const existingUser = await this.userRepository.getByEmail(email);
        if(existingUser) {
            throw new Error("User Already Exists");
        }
        const hashedPass = await this.hashingService.hashPassword(password);
        const user = await this.userRepository.create({
            name,
            email,
            password: hashedPass,
        });
        const { password: _, is_active, role, ...userWithoutPass} = user;
        return userWithoutPass;
    }

    async update(id, data) {
        const parseId = Number(id);
        validateIntegerValues(parseId, "User ID");
        const user = await this.userRepository.getById(parseId);
        notFound(user, "User");
        const updatedData = { ...data };
        if(updatedData.password) {
            updatedData.password = await this.hashingService.hashPassword(updatedData.password);
        }
        const updatedUser = await this.userRepository.update(parseId, updatedData);
        const { password: _, is_active, role, ...userWithoutPass } = updatedUser;
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
            const parseId = Number(id);
            validateIntegerValues(parseId, "UserID");
            return await this.userRepository.activateUser(parseId);
        }catch(error) {
            throw error;
        }
    }

    async deactivateUser(id) {
        try {
            const parseId = Number(id);
            validateIntegerValues(parseId, "User ID");
            notFound(parseId, "User");
            return await this.userRepository.deactivateUser(parseId);
        }catch(error) {
            throw error;
        }
    }

    async updatePassword(id, password) {
        try {
            const parseId = Number(id);
            validateIntegerValues(parseId);
            const hashedPass = await this.hashingService.hashPassword(password);
            await this.userRepository.updatePassword(parseId, hashedPass);
            const user = await this.userRepository.getById(parseId);
            notFound(user, 'User');
            return { message: 'Password updated successfully' };
        }catch(error) {
            throw error;
        }
    }
}