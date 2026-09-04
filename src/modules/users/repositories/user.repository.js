import pool from "../../../config/db.config.js";
export class UserRepository {
    async getAll() {//(page, limit) { 
        // if (page === undefined || limit === undefined || Number.isNaN(page) || Number.isNaN(limit)) {
        //     const result = await pool.query(
        //         'SELECT * FROM users WHERE role =$1', ['user']
        //     );
        //     result.rows.map((user) => {
        //         user.is_active === true ? user.is_active = 'Active' : user.is_active = 'Inactive';
        //     });
        //     return {
        //         data: result.rows,
        //         pagination: null
        //     };
        // };

        // const offset = (page - 1) * limit;
        // const result = await pool.query(
        //     "SELECT * FROM users WHERE role = $1 ORDER by id ASC LIMIT $2 OFFSET $3", ['user', limit, offset]
        // );
        // result.rows.map((user) => {
        //     user.is_active === true ? user.is_active = 'Active' : user.is_active = 'Inactive';
        // });

        // const countResult = await pool.query(
        //     "SELECT COUNT(*) FROM users WHERE role = $1", ['user']
        // );
        // const total = parseInt(countResult.rows[0].count);
        const result = await pool.query("SELECT * FROM users WHERE role = $1", ['user']
        );
        return {
            data: result.rows,
            // pagination: {
            //     total: total,
            //     page,
            //     limit,
            //     totalPages: Math.ceil(total / limit),
            //     hasNextPage: page < Math.ceil(total / limit),
            //     hasPrevPage: page > 1
            // }
        };
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
        const {firstname, lastname, email, password} = data;
        const result = await pool.query(
            "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [firstname, lastname, email, password]
        );
        return result.rows[0];
    }

    async update(id,data) {
        const fields = [];
        const values = [];
        let counter = 1;
        if(data.firstname !== undefined) {
            fields.push(`first_name = $${counter++}`);
            values.push(data.firstname);
        }
        if(data.lastname !== undefined) {
            fields.push(`last_name = $${counter++}`);
            values.push(data.lastname);
        }
        if(data.email !== undefined) {
            fields.push(`email = $${counter++}`);
            values.push(data.email);
        }
        if(data.password !== undefined) {
            fields.push(`password = $${counter++}`);
            values.push(data.password);
        }
        if(data.is_active !== undefined) {
            fields.push(`is_active = $${counter++}`);
            values.push(data.is_active);
        }
        values.push(id);

        const result = await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${counter} RETURNING *`, values
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

    async deactivateUser(id) {
        const result = await pool.query(
            'UPDATE users SET is_active = false WHERE id = $1 AND role = $2 RETURNING *', [id, 'user']
        );
        return result.rows[0];
    }
}