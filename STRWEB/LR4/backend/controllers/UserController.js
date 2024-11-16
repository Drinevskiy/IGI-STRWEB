import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) =>{
    try{
        const salt = await bcrypt.genSalt(15);
        const hash = await bcrypt.hash(req.body.password, salt);
        const doc = new UserModel({
            email: req.body.email,
            username: req.body.username,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        })
        const user = await doc.save();
        const token = jwt.sign({
            id: user._id,
        }, 
        'randomkey',
        {
            expiresIn: '30d',
        })

        const {passwordHash, ...userData} = user._doc;
        
        res.json({
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
            return res.status(404).json({
                message: "Ошибка входа. Проверьте email и пароль."
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if(!isValidPass){
            return res.status(404).json({
                message: "Ошибка входа. Проверьте email и пароль."
            })
        }
        const token = jwt.sign({
            id: user._id,
        }, 
        'randomkey',
        {
            expiresIn: '30d',
        })

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

export const profile = async (req, res) => {
    try{
        const user = await UserModel.findById(req.userId);
        if(user){
            const {passwordHash, ...userData} = user._doc;
            return res.json(userData);
        }
        else{
            return res.status(404).json({
                message: "Пользователь не найден"
            })
        }
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить данные профиля :("
        });
    }
};