import pool from "../../../config/db.config.js";

export class ExpenseRepository {
    async getAll(userId) {
        const result = await pool.query(
            "SELECT * FROM expenses WHERE user_id = $1 ORDER by date DESC", [userId]
        );
        return result.rows;
    }

    async getById(id, userId) {
        const result = await pool.query(
            "SELECT * FROM expenses WHERE id = $1 AND user_id = $2", [id, userId]
        );
        return result.rows[0];
    }

    async create(userId, data) {
        const {title, amount, category, date, note} = data;
        const result = await pool.query(
            "INSERT INTO expenses (user_id, title, amount, category, date, note) VALUES ($1, $2, $3, $4, $5, $6) RETRNING *", 
            [userId, title, amount, category, date, note]
        );
        return result.rows[0];
    }

    async update(id, userId, data) {
        const {title, amount, category, date, note} = data;
        const result = await pool.query(
            "UPDATE expenses SET title = $1, amount = $2, category = $3, date = $4, note = $5 WHERE id = $6 AND user_id = $7 RETURNING *",
            [title, amount, category, date, note, id, userId]
        );
        return result.rows[0];
    }

    async delete(id, userId) {
        const result = await pool.query(
            "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        );
    }
}