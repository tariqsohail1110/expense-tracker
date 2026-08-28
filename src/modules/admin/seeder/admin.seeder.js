import { HashingService } from "../../../common/hashingService/hashing.service.js";
import pool from "../../../config/db.config.js";
import dotenv from 'dotenv';

dotenv.config();

export class AdminSeeder {
    constructor() {
        this.hashingService = new HashingService();
    }

    async getAdminByEmail(email) {
        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE email = $1 AND role = \'admin\'', [email]
            );
            return result.rows[0];
        }catch(error) {
            throw error;
        }
    }

    async createAdmin(data) {
        try {
            const { firstname, lastname, email, password, role } = data;
            const result = await pool.query(
                'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *', [firstname, lastname, email, password, role]
            );
            return result.rows[0];
        }catch(error) {
            throw error;
        }
    }

    async seed() {
        try {
            console.log("Seeding Admin");

            const email = process.env.EMAIL;
            const alreadyExists = await this.getAdminByEmail(email);

            if(alreadyExists) {
                console.log('Admin Already Exists, Skipping');
                return;
            }
            const password = process.env.PASSWORD;
            const hashedPass = await this.hashingService.hashPassword(password);
            await this.createAdmin({
                firstname: process.env.FIRSTNAME,
                lastname: process.env.LASTNAME,
                email,
                password: hashedPass,
                role: 'admin',
            });
            console.log('Admin created Successfully');
        }catch(error) {
            console.log('Error seeding admin', error);
        }
    }
}