import pool from '../../../config/db.config.js'

export class BudgetRepository {
    async getBudgetByUserId(userId) {
        const result = await pool.query(
            `SELECT * FROM budget WHERE user_id = $1`, [userId]
        );
        return result.rows[0];
    }

    async createBudget(userId, data) {
        const { totalBudget, remainingBudget } = data;
        const result = await pool.query(
            `INSERT INTO budget (user_id, total_budget, remaining_budget) VALUES ($1, $2, $3) RETURNING *`, [userId, totalBudget, remainingBudget]
        );
        return result.rows[0];
    }

    async updateMyBudget(userId, data) {
        const { totalBudget, remainingBudget } = data;
        const result = await pool.query(
            `UPDATE budget SET total_budget = $1, remaining_budget = $2 WHERE user_id = $3 RETURNING *`, [totalBudget, remainingBudget, userId]
        );
        return result.rows[0];
    }

    async updateBudget(userId, remainingBudget) {
        const result = await pool.query(
            `UPDATE budget SET remaining_budget = $2 WHERE user_id = $1 RETURNING *`, [userId, remainingBudget]
        );
        return result.rows[0];
    }

    async deleteBudget(userId) {
        const result = await pool.query(
            `DELETE FROM budget WHERE user_id = $1 RETURNING *`, [userId]
        );
        return result.rows[0];
    }
}