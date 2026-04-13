import { notExists, notFound } from "../../../common/errors/not-exist.error.js";
import { validateIntegerValues } from "../../../common/errors/validate-integer values.error.js";
import { HashingService } from "../../../common/hashingService/hashing.service.js";
import { AdminRepository } from "../repositories/admin.repository.js";

export class AdminService {
    constructor() {
        this.adminRepository = new AdminRepository();
        this.hashingService = new HashingService();
    }

    async getAllAdmins() {
        try {
            const admins = await this.adminRepository.getAllAdmins();
            return admins;
        }catch(error) {
            throw error;
        }
    }

    async getAdminById(id) {
        try {
            const parseId = Number(id);
            validateIntegerValues(parseId, 'Admin Id');
            const admin = await this.adminRepository.getAdminById(parseId);
            return notExists(admin, 'Admin');
        }catch(error) {
            throw error;
        }
    }

    async getAdminByEmail(email) {
        try {
            const admin = await this.adminRepository.getAdminByEmail(email);
            return notExists(admin, 'Admin');
        }catch(error) {
            throw error;
        }
    }

    async createAdmin(data) {
        try{
            const { name, email, password, } = data;
            const existingAdmin = await this.adminRepository.getAdminByEmail(email);
            if(existingAdmin) {
                throw new Error('Admin Already Exists');
            }
            const hashedPass = await this.hashingService.hashPassword(password);
            const admin = await this.adminRepository.createAdmin({
                name,
                email,
                password: hashedPass,
                role: 'admin',
            });
            const { password: _, is_active, role, ...adminWithoutPass } = admin;
            return adminWithoutPass;
        }catch(error) {
            throw error;
        }
    }

    async updateAdmin(id, data) {
        try {
            const parseId = Number(id);
            validateIntegerValues(parseId, 'Admin ID');
            const admin = await this.adminRepository.getAdminById(parseId);
            notFound(admin, "Admin");
            const updatedData = { ...data };
            if(updatedData.password) {
                updatedData.password = await this.hashingService.hashPassword(updatedData.password);
            }
            const updatedAdmin = await this.adminRepository.updateAdmin(parseId, updatedData);
            const { password: _, is_active, role, ...adminWithoutPass } = updatedAdmin;
            return updatedAdmin;
        }catch(error) {
            throw error;
        }
    } 

    async changeRole(id, role) {
        try {
            const parseId = Number(id)
            validateIntegerValues(parseId,"Admin ID");
            const admin = await this.adminRepository.getAdminById(parseId);
            notFound(admin, "Admin");
            const changedRole = await this.adminRepository.changeRole(parseId, role);
            return changedRole;
        }catch(error) {
            throw error;
        }
    }

    async deleteAdmin(id) {
        try {
            const parseId = Number(id);
            validateIntegerValues(parseId, "Admin ID");
            const admin = await this.adminRepository.getAdminById(parseId);
            notFound(admin, "Admin");
            await this.adminRepository.deleteAdmin(parseId);   
        }catch(error) {
            throw error;
        }
    }
}