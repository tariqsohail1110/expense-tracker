import pool from "../../../config/db.config.js";
export class OtpRepository {
    async getById(id) {
        const result = await pool.query(
            "SELECT * FROM otps WHERE id = $1", [id]
        );
        return result.rows[0];
    }

    async getOtpByUserId(userId) {
        const result = await pool.query(
            "SELECT * FROM otps WHERE user_id = $1", [userId] 
        );
        return result.rows[0];
    }

    async createOtp(
        userId,
        email,
        code,
        purpose,
        expiresIn
    ) {
        const result = await pool.query(
            "INSERT INTO otps (user_id, code, purpose, email, expired_at) VALUES ($1, $2, $3, $4, $5) RETURNING *", [userId, code, purpose, email, expiresIn]
        );
        return result.rows[0];
    }

    async findLatestValidOtp(
        userId,
        purpose
    ) {
        const result = await pool.query(
            "SELECT * FROM otps WHERE user_id = $1 AND purpose = $2 AND isUsed = false AND expired_at > NOW() ORDER BY created_at DESC LIMIT 1", [userId, purpose]
        );
        return result.rows[0];
    }

    async markAsUsed(id) {
        const result = await pool.query(
            "UPDATE otps SET isUsed = true WHERE id = $1 RETURNING *", [id] 
        );
        return result.rows[0];
    }

    async incrementAttempts(id) {
        await pool.query(
            "UPDATE otps SET attempts = attempts + 1 WHERE id = $1", [id]
        );
    }

    async deleteExpiredOtp() {
        const result = await pool.query(
            "DELETE FROM otps WHERE expired_at < NOW() RETURNING *"
        );
        return result.rows[0];
    }

    // async deleteUserOtps(
    //     userId,
    //     purpose
    // ) {
    //     const result = await pool.query(
    //         "DELETE FROM otps WHERE user_id = $1 AND purpose = $2 RETURNING *", [userId, purpose]
    //     );
    //     return result.rows[0];
    // }

    async countRecentOtps(
        userId, 
        purpose,
        minutesAgo
    ) {
        const sinceTime = new Date();
        sinceTime.setMinutes(sinceTime.getMinutes() - minutesAgo);
        const result = await pool.query(
            "SELECT COUNT(*) FROM otps WHERE user_id = $1 AND purpose = $2 AND created_at > $3", [userId, purpose, sinceTime]
        );
        return parseInt(result.rows[0].count);
    }
}