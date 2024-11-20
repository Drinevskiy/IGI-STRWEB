import jwt from 'jsonwebtoken';
import config from 'config';
import axios from 'axios';
import UserModel from '../models/User.js'; // Убедитесь, что путь правильный
import {logout} from "../controllers/UserController.js";
import { refreshToken } from './refreshToken.js';
import { OAuth2Client } from 'google-auth-library';


const SECRET_KEY = config.get('SECRET_KEY');
const REFRESH_SECRET_KEY = config.get('REFRESH_SECRET_KEY');
const ACCESS_TOKEN_EXPIRES_IN = config.get('ACCESS_TOKEN_EXPIRES_IN');
const GOOGLE_CLIENT_ID = config.get('GOOGLE_CLIENT_ID');

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function getGoogleUserInfo(accessToken) {
    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?accessToken=${accessToken}`);
        return response.data; // Возвращает данные пользователя
    } catch (error) {
        console.error('Ошибка при получении информации о пользователе:', error);
        throw error; // Обработка ошибок
    }
}

async function getFacebookUserInfo(accessToken) {
    try {
        const response = await axios.get(`https://graph.facebook.com/v5.0/me?fields=email,id,first_name,name&access_token={ACCESS-TOKEN-HERE}`);
        return response.data; // Возвращает данные пользователя
    } catch (error) {
        console.error('Ошибка при получении информации о пользователе:', error);
        throw error; // Обработка ошибок
    }
}

export default async (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.userId = decoded.id;
            return next();
            
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return refreshToken(req, res, next)
            }
            try{
                const user = await getGoogleUserInfo(token);
                req.userId = user.sub; // Установите userId в запрос
                req.isGoogle = true;
                return next();
            }
            catch(error){
                try{
                    const user = await getFacebookUserInfo(token);
                    req.userId = user.id; // Установите userId в запрос
                    req.isFacebook = true;
                    return next();
                }
                catch(er){
                    console.log(err);
                    return res.status(403).json({ message: "Отказано в доступе" });
                }
                console.log(err);
                
                return res.status(403).json({ message: "Отказано в доступе" });
            }
        }
    } else {
        return res.status(403).json({ message: "Отказано в доступе" });
    }
};