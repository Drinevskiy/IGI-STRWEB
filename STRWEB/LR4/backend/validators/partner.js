import { body } from 'express-validator';

export const partnerCreateValidator = [
    body('name', "Название партнера должно содержать от 2 до 15 символов").isLength({min: 2, max: 15}),
    body('url', 'Неверная ссылка на сайт').isURL(),
    body('imageUrl', 'Неверная ссылка на аватарку').isURL()
];