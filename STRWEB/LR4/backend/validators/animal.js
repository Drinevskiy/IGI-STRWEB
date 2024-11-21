import { body } from 'express-validator';

export const animalCreateValidator = [
    body('name')
        .isLength({ min: 1, max: 20 })
        .withMessage("Имя должно содержать от 1 до 20 символов")
        .trim(),

    body('type')
        .isLength({ min: 1, max: 40 })
        .withMessage("Вид должен содержать от 1 до 20 символов")
        .trim(),

    body('family')
        .isLength({ min: 1, max: 40 })
        .withMessage("Семейство должно содержать от 1 до 20 символов")
        .trim(),

    body('description')
        .isLength({ min: 1, max: 500 })
        .withMessage("Описание должно содержать от 1 до 500 символов")
        .trim(),

    body('aviary')
        .isMongoId()
        .withMessage("ID вольера должен быть корректным MongoDB ObjectId"),

    body('date_of_receipt')
        .isISO8601()
        .withMessage("Дата поступления должна быть корректным форматом даты (ISO 8601)")
        .toDate(),

    body('date_of_birth')
        .isISO8601()
        .withMessage("Дата рождения должна быть корректным форматом даты (ISO 8601)")
        .toDate(),

    body('image')
        .notEmpty()
        .withMessage("Фото обязательно для загрузки")
];