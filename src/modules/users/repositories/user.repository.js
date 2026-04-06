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
        const {name, email, password} = data;
        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, password]
        );
        return result.rows[0];
    }

    async update(id,data) {
        const {name, email, password} = data;
        const result = await pool.query(
            "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *", 
            [name, email, password, id]
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
        return result.rows[0];
    }
}