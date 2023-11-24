import jwt from 'jsonwebtoken';
import {APIError} from "./errors";

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new APIError(401, 'Invalid Token');
    }
};
