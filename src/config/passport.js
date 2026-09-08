import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';
import pool from "./db.config.js";

let users = [];
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/v1/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            let user = users.find((user) => user.googleId === profile.id);
            if(!user) {
                try {
                    const email =  profile.emails[0]?.value;
                    const googleId =  profile.id;
                    const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User';
                    const lastName = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || 'User';

                    let result = await pool.query(
                        "SELECT * FROM users WHERE google_id = $1", [googleId]
                    );
                    let user = result.rows[0];

                    if(!user && email) {
                        result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
                        user = result.rows[0];

                        if (user) {
                            const updated = await pool.query(
                                "UPDATE users SET google_id = $1, is_active = true WHERE id = $2 RETURNING *", [googleId, user.id]
                            );
                            user = updated.rows[0];
                        }
                    }
                    if(!user) {
                        const insert = await pool.query(
                            "INSERT INTO users (first_name, last_name, email, google_id, is_active, role) VALUES ($1, $2, $3, $4, true, 'user') RETURNING *", [firstName, lastName, email, googleId]
                        );
                        user = insert.rows[0];
                    }
                    return done(null, user);
                } catch(error) {
                    return done(error, null);
                }
            }
        }
    )
);

export default passport;