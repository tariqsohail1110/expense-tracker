import pool from "../../../config/db.config.js";

export class UserRepository {
    async getAll() { 
        const result = await pool.query(
            "SELECT * FROM users WHERE role = $1", ['user']
        );
        // console.log('Result:', result.rows);
        return result.rows;
    }

    async getById(id) {
        const result = await pool.query(
            "SELECT * FROM users WHERE id = $1 AND role = $2", [id, 'user']
        );
        return result.rows[0];
    }

    async getByEmail(email) {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1 AND role = $2", [email, 'user']
        );
        return result.rows[0];
    }

    async create(data) {
        const {name, email, password} = data;
        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, password]
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
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${counter} AND role = 'user' RETURNING *`, values
        );
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 AND role = $2 RETURNING *", [id, 'user']
        );
        return result.rows[0];
    }

    async activateUser(id) {
        const result = await pool.query(
            "UPDATE users SET is_active = true WHERE id = $1 AND role = $2 RETURNING *", [id, 'user']
        );
        return result.rows[0];
    }

    async updatePassword(id, password) {
        const result = await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2 AND role = $3 RETURNING *", [password, id, 'role']
        );
        if(result.rowCount === 0 || !result.rows[0]) {
            throw new Error('User not found');
        }
        return result.rows[0];
    }

    async deactivateUser(id) {
        const result = await pool.query(
            'UPDATE users SET is_active = false WHERE id = $1 AND role = $2 RETURNING *', [id, 'user']
        );
        return result.rows[0];
    }
}