import { body } from 'express-validator';

export const newCreateValidator = [
    body('header')
        .isLength({ min: 1, max: 100 })
        .withMessage("Заголовок должен содержать от 1 до 100 символов")
        .trim(),

    body('description')
        .isLength({ min: 1, max: 3000 })
        .withMessage("Описание должно содержать от 1 до 1000 символов")
        .trim(),

    body('image')
        .notEmpty()
        .withMessage("Фото обязательно для загрузки"),

    body('publication_date')
        .isISO8601()
        .withMessage("Дата публикации должна быть корректным форматом даты (ISO 8601)")
        .toDate() // Преобразует дату в объект Date
];