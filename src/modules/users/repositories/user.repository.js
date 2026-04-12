import pool from "../../../config/db.config.js";

export class UserRepository {
    async getAll() { 
        const result = await pool.query(
            "SELECT * FROM users"
        );
        // console.log('Result:', result.rows);
        return result.rows;
    }

    async getById(id) {
        const result = await pool.query(
            "SELECT * FROM users WHERE id = $1", [id]
        );
        return result.rows[0];
    }

    async getByEmail(email) {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1", [email]
        );
        return result.rows[0];
    }

    async create(data) {
        const {name, email, password, role} = data;
        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, password, role]
        );
        return result.rows[0];
    }

    async update(id,data) {
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

    async delete(id) {
        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *", [id]
        );
    }

    async activateUser(id) {
        const result = await pool.query(
            "UPDATE users SET is_active = true WHERE id = $1 RETURNING *", [id]
        );
        return result.rows[0];
    }

    async updatePassword(id, password) {
        const result = await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2 RETURNING *", [password, id]
        );
        if(result.rowCount === 0 || !result.rows[0]) {
            throw new Error('User not found');
        }
        return result.rows[0];
    }
}