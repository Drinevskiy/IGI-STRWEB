import jwt from 'jsonwebtoken';
import config from 'config';
import UserModel from '../models/User.js'; // Убедитесь, что путь правильный
import {logout} from "../controllers/UserController.js";
import { refreshToken } from './refreshToken.js';

const SECRET_KEY = config.get('SECRET_KEY');
const REFRESH_SECRET_KEY = config.get('REFRESH_SECRET_KEY');
const ACCESS_TOKEN_EXPIRES_IN = config.get('ACCESS_TOKEN_EXPIRES_IN');

export default async (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.userId = decoded.id; // Установите userId в запрос
            console.log(req.userId);
            return next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return refreshToken(req, res, next)
            }
            return res.status(403).json({ message: "Отказано в доступе" });
        }
    } else {
        return res.status(403).json({ message: "Отказано в доступе" });
    }
};