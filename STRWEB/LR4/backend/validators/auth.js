import { body } from 'express-validator';

export const registerValidator = [
    body('email', "Неверный формат почты").isEmail(),
    body('username', "Ник пользователя должен содержать от 3 до 15 символов").isLength({min: 3, max: 15}),
    body('password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры.'),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL()
];

export const loginValidator = [
    body('email', "Неверный формат почты").isEmail(),
    body('password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры.'),
]