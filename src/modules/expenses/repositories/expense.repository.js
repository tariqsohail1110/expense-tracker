import pool from "../../../config/db.config.js";

export class ExpenseRepository {
    async getAll(userId, page, limit) {
        const offset = (page - 1) * limit;
        const result = await pool.query(
            "SELECT * FROM expenses WHERE user_id = $1 ORDER by date DESC LIMIT $2 OFFSET $3", [userId, limit, offset] 
        );

        const countResult = await pool.query(
            "SELECT COUNT(*) FROM expenses WHERE user_id = $1", [userId]
        );

        const total = parseInt(countResult.rows[0].count);
        return {
            data: result.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        };
    }

    async getById(id, userId) {
        const result = await pool.query(
            "SELECT * FROM expenses WHERE id = $1 AND user_id = $2", [id, userId]
        );
        return result.rows[0];
    }

    async createWithClient(client, userId, data) {
        const {title, amount, category, date, note} = data;
        const result = await client.query(
            "INSERT INTO expenses (user_id, title, amount, category, date, note) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", 
            [userId, title, amount, category, date, note]
        );
        return result.rows[0];
    }

    async update(id, userId, data) {
        const fields = [];
        const values = [];
        let counter = 1;
        if(data.title !== undefined) {
            fields.push(`title = $${counter++}`);
            values.push(data.title);
        }
        if(data.amount !== undefined) {
            fields.push(`amount = $${counter++}`);
            values.push(data.amount);
        }
        if(data.category !== undefined) {
            fields.push(`category = $${counter++}`);
            values.push(data.category);
        }
        if(data.date !== undefined) {
            fields.push(`date = $${counter++}`);
            values.push(data.date);
        }
        if(data.note !== undefined) {
            fields.push(`note = $${counter++}`);
            values.push(data.note);
        }
        values.push(id);
        values.push(userId);
        const result = await pool.query(
            `UPDATE expenses SET ${fields.join(', ')} WHERE id = $${counter} AND user_id = $${counter + 1} RETURNING *`,
            values
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