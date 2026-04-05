import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    const token = req.token;

    if(!token) {
        return await res.status(403).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        if(decoded.type !== 'access') {
            return await res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    }catch(error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}