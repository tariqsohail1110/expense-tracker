import jwt from 'jsonwebtoken';
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const readPublicKey = () => {
        return fs.readFileSync(join(__dirname, '../../keys/public_key.pem'), 'utf8');
    }

export const authMiddleware = async (req, res, next) => {
    const token = req.token;

    if(!token) {
        return await res.status(403).json({ message: 'No token provided' });
    }
    try {
        const key = readPublicKey();
        const decoded = jwt.verify(token, key, {
            algorithms: ['RS256']
        });
        if(decoded.type !== 'access') {
            return await res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    }catch(error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}