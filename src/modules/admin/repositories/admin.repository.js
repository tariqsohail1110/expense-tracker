import pool from "../../../config/db.config.js";

export class AdminRepository {
    async getAllAdmins() {
        const result = await pool.query(
            'SELECT * FROM users WHERE role = \'admin\''
        );
        return result.rows;
    }

    async getAdminById(adminId) {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1 AND role = \'admin\'', [adminId]
        );
        return result.rows[0];
    }

    async getAdminByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND role = \'admin\'', [email]
        );
        return result.rows[0];
    }

    async getSuperAdminByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND role = \'super_admin\'', [email]
        );
        return result.rows[0];
    }

    async createAdmin(data) {
        const { name, email, password, role } = data;
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, password, role]
        );
        return result.rows[0];
    }

    async updateAdmin(id, data) {
        const fields = [];
        const values = [];
        let counter = 1;
        if(data.name !== undefined) {
            fields.push(`name = $${counter++}`);
            values.push(data.name);
        }
        if(data.email !== undefined) {
            fields.push(`email = $${counter++}`);
            values.push(data.email);
        }
        if(data.password !== undefined) {
            fields.push(`password = $${counter++}`);
            values.push(data.password);
        }
        values.push(id);

        const result = await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${counter} RETURNING *`, values
        );
        return result.rows[0];
    }

    async changeRole(id, role) {
        const result = await pool.query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING *', [role, id]
        );
        return result.rows[0];
    }

    async deleteAdmin(id) {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 AND role = \'admin\'', [id]
        );
        return result.rows[0];
    }
}