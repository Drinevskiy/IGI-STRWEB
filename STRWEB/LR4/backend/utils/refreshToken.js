import config from 'config';
import {logout} from "../controllers/UserController.js";
import UserModel from '../models/User.js'; 
import jwt from 'jsonwebtoken';

const SECRET_KEY = config.get('SECRET_KEY');
const REFRESH_SECRET_KEY = config.get('REFRESH_SECRET_KEY');
const ACCESS_TOKEN_EXPIRES_IN = config.get('ACCESS_TOKEN_EXPIRES_IN');

export const refreshToken = async (req, res, next) => {
    // Если токен истек, попробуем использовать refresh token
    const refreshToken = req.cookies.refreshToken; // Получаем refresh token из куков
    // console.log(refreshToken);
    if (!refreshToken) {
        return logout(req,res);
    }

    try {
        const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const user = await UserModel.findById(decodedRefresh.id);

        if (!user || !user.refreshTokens.includes(refreshToken)) {
            return logout(req,res);
        }

        // Создаем новый access token
        const newAccessToken = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
        console.log(`Новый access token ${newAccessToken}`);
        // Отправляем новый токен в ответе
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        req.userId = user._id; // Устанавливаем userId в запрос
        return next();
    } catch (refreshError) {
        return logout(req,res);

    }
};