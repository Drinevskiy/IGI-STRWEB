import express from 'express';
import config from 'config';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import { registerMulter, registerRoutes } from './utils/index.js';

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
app.get('/', (req, res) => {
    res.send("Hello")
});

registerMulter(app);
registerRoutes(app);

const PORT = config.get('port') || 5000;
app.listen(PORT, () => console.log(`Start server on port ${PORT}`));

