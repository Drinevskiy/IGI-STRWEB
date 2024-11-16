import { body } from 'express-validator';

export const aviaryCreateValidator = [
    body('name')
        .isLength({ min: 2, max: 25 })
        .withMessage("Название должно содержать от 2 до 25 символов")
        .trim(),
    
    body('square')
        .isInt({ min: 1 })
        .withMessage('Площадь должна быть положительным целым числом'),

    body('reservoir')
        .isBoolean()
        .withMessage('Поле "Водоем" должно быть булевым значением (true или false)'),

    body('heating')
        .isBoolean()
        .withMessage('Поле "Отопление" должно быть булевым значением (true или false)')
];