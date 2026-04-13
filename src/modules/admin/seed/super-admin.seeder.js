import { HashingService } from "../../../common/hashingService/hashing.service.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { AdminRepository } from "../repositories/admin.repository.js";
import dotenv from 'dotenv';

dotenv.config();

export class SuperAdminSeeder {
    constructor() {
        this.adminRepository = new AdminRepository();
        this.hashingService = new HashingService();
    }

    async seed() {
        try {
            console.log("Seeding Super Admin");

            const email = process.env.EMAIL;
            const alreadyExists = await this.adminRepository.getSuperAdminByEmail(email);

            if(alreadyExists) {
                console.log('Super Admin Already Exists, Skipping');
                return;
            }
            const password = process.env.PASSWORD;
            const hashedPass = await this.hashingService.hashPassword(password);
            await this.adminRepository.createAdmin({
                name: process.env.NAME,
                email,
                password: hashedPass,
                role: 'super_admin',
            });
            console.log('Super Admin created Successfully');
        }catch(error) {
            console.log('Error seeding admin', error);
        }
    }
}