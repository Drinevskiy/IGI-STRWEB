import express from 'express';
import session from 'express-session';
import passport from 'passport';
import config from 'config';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import { registerMulter, registerRoutes, registerPassport } from './utils/index.js';

const SESSION_SECRET_KEY = config.get('SESSION_SECRET_KEY');

mongoose
    .connect(config.get('mongoUri'))
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB failed connect', err));

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Укажите адрес вашего клиента
    credentials: true
}));
app.use(session({
    secret: SESSION_SECRET_KEY, // Замените на ваш секретный ключ
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Установите true, если используете HTTPS
})); 

app.get('/', (req, res) => {
    res.send("Hello")
});

registerMulter(app);
registerRoutes(app);
registerPassport();
  

const PORT = config.get('port') || 5000;
app.listen(PORT, () => console.log(`Start server on port ${PORT}`));

