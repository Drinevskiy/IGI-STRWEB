import express from 'express';
import multer from 'multer';
import config from 'config';
import {checkAuth} from './index.js';


export default async (app) => {
    const dirToUpload = config.get('uploads') || 'uploads';
    const storage = multer.diskStorage({
        destination: (_, __, callback) => {
            callback(null,  dirToUpload);
        },
        filename: (_, file, callback) => {
            callback(null, file.originalname);
        }
    });

    const upload = multer({storage});

    app.use('/' + dirToUpload, express.static(dirToUpload));

    app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
        res.json({
            url: `${dirToUpload}/${req.file.originalname}`
        });
    });
}