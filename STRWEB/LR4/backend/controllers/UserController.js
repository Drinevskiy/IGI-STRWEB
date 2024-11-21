import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
import config from 'config';
import passport from "passport";

const SECRET_KEY = config.get('SECRET_KEY');
const REFRESH_SECRET_KEY = config.get('REFRESH_SECRET_KEY');
const ACCESS_TOKEN_EXPIRES_IN = config.get('ACCESS_TOKEN_EXPIRES_IN');
const REFRESH_TOKEN_EXPIRES_IN = config.get('REFRESH_TOKEN_EXPIRES_IN');
const SALT_ROUNDS = config.get('SALT_ROUNDS');


export const register = async (req, res) =>{
    try{
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json([{ message: "Пользователь с таким email уже существует." }]);
        }
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(req.body.password, salt);
        const doc = new UserModel({
            email: req.body.email,
            username: req.body.username,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        });
        const user = await doc.save();
        const token = jwt.sign({id: user._id,}, SECRET_KEY, {expiresIn: ACCESS_TOKEN_EXPIRES_IN,});
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
        user.refreshTokens.push(refreshToken);
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Защита от XSS
            // secure: process.env.NODE_ENV === 'production', // Используйте secure только в продакшене
            sameSite: 'Strict',
        });

        const {passwordHash, ...userData} = user._doc;
        
        res.status(201).json({
            ...userData,
            token
        });
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: "Не удалось зарегистрироваться :("
        });
    }
};

export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({email:req.body.email});
        if(!user){
            return res.status(404).json([{
                message: "Ошибка входа. Проверьте email и пароль."
            }])
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if(!isValidPass){
            return res.status(404).json([{
                message: "Ошибка входа. Проверьте email и пароль."
            }])
        }
        const token = jwt.sign({id: user._id,}, SECRET_KEY, {expiresIn: ACCESS_TOKEN_EXPIRES_IN,});
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
        user.refreshTokens.push(refreshToken);
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            // expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        const {passwordHash, ...userData} = user._doc;
        
        res.json({
            ...userData,
            token
        });
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: "Не удалось авторизоваться :("
        });
    }
};

export const logout = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.sendStatus(204); // Нет содержимого
    }

    try {
        const user = await UserModel.findOne({ refreshTokens: refreshToken });
        if (user) {
            user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
            await user.save();
        }

        res.clearCookie('refreshToken'); // Удаляем refresh token из куков
        res.status(200).json({ message: "Вы вышли из системы" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ошибка при выходе" });
    }
};

export const profile = async (req, res) => {
    try{
        let user;
        if(req.isGoogle){
            user = await UserModel.findOne({ googleId: req.userId });
        }
        else if(req.isTwitter){
            user = await UserModel.findOne({ twitterId: req.userId });
        } 
        else{
            user = await UserModel.findById(req.userId);
        }
        if(user){
            let {passwordHash, ...userData} = user._doc;
            if(req.isGoogle || req.isTwitter){
                userData.isServices = true;
            }
            return res.json(userData);
        }
        else{
            return res.status(404).json({
                message: "Пользователь не найден"
            })
        }
    } catch(err){
        console.log("Ошибка", err);
        res.status(500).json({
            message: "Не удалось получить данные профиля :("
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body; // Получаем старый и новый пароли из тела запроса
        const user = await UserModel.findById(req.userId); // Находим пользователя по ID

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        // Сравниваем старый пароль с хешем в базе данных
        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Неверный старый пароль" });
        }

        // Хешируем новый пароль
        const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Сохраняем новый хеш пароля в базе данных
        user.passwordHash = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: "Пароль успешно изменён" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Не удалось изменить пароль" });
    }
};

export const googleLogin = (req, res) => {
    passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })(req, res);
}

export const googleRedirect = (req, res) => {
    passport.authenticate('google', { failureRedirect: "http://localhost:3000/login" }, (err, user) => {
        if (err || !user) {
            return res.redirect("http://localhost:3000/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log(err);
                return res.redirect("http://localhost:3000/login");
            }
            res.redirect(`http://localhost:3000/?accessToken=${user.accessToken}`);
        });
    })(req, res);
}

export const facebookLogin = (req, res) => {
    passport.authenticate('facebook')(req,res);
    // passport.authenticate('facebook', { scope: ['profile', 'email'], prompt: 'select_account' })(req, res);
}

export const facebookRedirect = (req, res) => {
    passport.authenticate('facebook', { successRedirect: "http://localhost:3000/", failureRedirect: "http://localhost:3000/login" }, (err, user) => {
        if (err || !user) {
            return res.redirect("http://localhost:3000/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log(err);
                return res.redirect("http://localhost:3000/login");
            }
            res.redirect(`http://localhost:3000/?accessToken=${user.accessToken}`);
        });
    })(req, res);
}

export const twitterLogin = (req, res) => {
    passport.authenticate('twitter', {scope: ['profile', 'email']})(req,res);
}

export const twitterRedirect = (req, res, next) => {
    passport.authenticate('twitter', { successRedirect: "http://localhost:3000/", failureRedirect: "http://localhost:3000/login" }, (err, user) => {
        if (err || !user) {
            return res.redirect("http://localhost:3000/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log(err);
                return res.redirect("http://localhost:3000/login");
            }
            res.cookie('refreshToken', user.accessTokenSecret, {
                httpOnly: true,
                sameSite: 'Strict',
            });
            res.redirect(`http://localhost:3000/?accessToken=${user.accessToken}`);
        });
    })(req, res, next);
}