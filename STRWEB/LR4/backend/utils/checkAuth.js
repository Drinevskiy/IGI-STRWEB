import jwt from 'jsonwebtoken';
import config from 'config';
import axios from 'axios';
import qs from 'qs';
import UserModel from '../models/User.js'; // Убедитесь, что путь правильный
import {logout} from "../controllers/UserController.js";
import { refreshToken } from './refreshToken.js';
import { OAuth2Client } from 'google-auth-library';
import oauth from 'oauth';

const SECRET_KEY = config.get('SECRET_KEY');
const REFRESH_SECRET_KEY = config.get('REFRESH_SECRET_KEY');
const ACCESS_TOKEN_EXPIRES_IN = config.get('ACCESS_TOKEN_EXPIRES_IN');
const GOOGLE_CLIENT_ID = config.get('GOOGLE_CLIENT_ID');
const TWITTER_BEARER_TOKEN = config.get('TWITTER_BEARER_TOKEN');
const TWITTER_API_KEY = config.get('TWITTER_API_KEY');
const TWITTER_API_KEY_SECRET = config.get('TWITTER_API_KEY_SECRET');

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Создаем клиент OAuth
const twitterOAuth = new oauth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    TWITTER_API_KEY,
    TWITTER_API_KEY_SECRET,
    '1.0A',
    null,
    'HMAC-SHA1'
);

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
        return response.data; 
    } catch (error) {
        console.error('Ошибка при получении информации о пользователе:', error);
        throw error; // Обработка ошибок
    }
}


async function getTwitterUserInfo(accessToken, accessTokenSecret) {
    const url = 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true';
    return new Promise((resolve, reject) => {
        twitterOAuth.get(url, accessToken, accessTokenSecret, (err, data) => {
            if (err) {
                console.error('Error verifying access token:', err);
                return reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
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
                req.userId = user.sub; 
                req.isGoogle = true;
                return next();
            }
            catch(error){
                try{
                    const user = await getTwitterUserInfo(token, req.cookies.refreshToken);
                    console.log("check", user);
                    req.userId = user.id_str; 
                    req.isTwitter = true;
                    return next();
                }
                catch(er){
                    console.log(er);
                    return res.status(403).json({ message: "Отказано в доступе" });
                }
            }
        }
    } else {
        return res.status(403).json({ message: "Отказано в доступе" });
    }
};