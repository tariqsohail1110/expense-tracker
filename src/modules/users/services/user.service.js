import { UserRepository } from "../repositories/user.repository.js";
import { validateIntegerValues } from "../../../common/errors/validate-integer values.error.js";
import { notExists, notFound } from "../../../common/errors/not-exist.error.js";
import { HashingService } from "../../../common/hashingService/hashing.service.js";
import excelJs from 'exceljs';

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
        this.hashingService = new HashingService();
    }

    async getAll() {//(page, limit) {
        // const parsePage = Number(page);
        // const parseLimit = Number(limit);
        const users = await this.userRepository.getAll()//(parsePage, parseLimit);
        users.data.map((user) => user.is_active === true ? user.is_active = 'Active' : user.is_active = 'Inactive')
        return users;
    }

    async getById(id) {
        const parseId = Number(id);
        validateIntegerValues(parseId, 'user ID');
        const user = await this.userRepository.getById(parseId);
        user.is_active === true ? user.is_active = 'Active' : user.is_active = 'Inactive';
        return notExists(user, "User");
    }

    async getByEmail(email) {
        const user = await this.userRepository.getByEmail(email);
        return notExists(user, "User");
    }

    async createUser(data) {
        const { firstname, lastname, email, password, } = data;
        const existingUser = await this.userRepository.getByEmail(email);
        if(existingUser) {
            throw new Error("User Already Exists");
        }
        const hashedPass = await this.hashingService.hashPassword(password);
        const user = await this.userRepository.create({
            firstname,
            lastname,
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

    async exportUsersXlsx() {
        try {
            const { data: users } = await this.getAll();
            const workBook = new excelJs.Workbook();
            const workSheet = workBook.addWorksheet('Users');
            workSheet.columns = [
                { header: 'ID', key: 'id', width: 10},
                { header: 'First Name', key: 'first_name', width: 20},
                { header: 'Last Name', key: 'last_name', width: 20},
                { header: 'Email', key: 'email', width: 40},
                { header: 'Status', key: 'is_active', width: 20},
                { header: 'Date Created', key: 'created_at', width: 30}
            ];
            users.forEach((user) => {
                workSheet.addRow(user);
            });
            workSheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            const buffer = await workBook.xlsx.writeBuffer('users.xlsx');
            return buffer;
        } catch (error) {
            throw error;
        }
    }
}