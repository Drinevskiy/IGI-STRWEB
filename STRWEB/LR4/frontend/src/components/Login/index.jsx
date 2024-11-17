import React, { useState } from 'react';
import axios from '../../utils/axios';
import { useSelector } from 'react-redux'; 
import { Navigate } from 'react-router-dom';
// import useToken from '../../utils/auth';
import { useAuth } from '../../utils/AuthContext';

const LoginForm = () => {
    const { token, saveToken } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState([]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Регулярное выражение для проверки email
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // Регулярное выражение для проверки пароля

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = [];

        // Валидация email
        if (!emailRegex.test(formData.email)) {
            validationErrors.push({ path: 'email', msg: 'Неверный формат email.' });
        }

        // Валидация пароля
        if (!passwordRegex.test(formData.password)) {
            validationErrors.push({ path: 'password', msg: 'Пароль должен содержать минимум 8 символов, включая заглавные буквы, строчные буквы и цифры.' });
        }

        // Если есть ошибки валидации, устанавливаем их и прерываем отправку
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        // Add form submission logic here (e.g., API call)
        axios.post('/auth/login', formData, { withCredentials: true })
            .then(res => {
                // console.log('isAuth');
                console.log(res.data);
                saveToken(res.data.token);
                // setToken(res.data.token);
            })
            .catch(error => {
                if (error.response && error.response.status === 400 || error.response.status === 404) {
                    // Обработка ошибок валидации от сервера
                    console.log(error.response.data);
                    setErrors(error.response.data);
                } else {
                    console.error(error);
                }});
        // console.log(formData);
    };

    if(token){
        return <Navigate to='/'/>
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Электронная почта
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                {errors.find(error => error.path === 'email') && (
                    <span style={{ color: 'red' }}>
                        {errors.find(error => error.path === 'email').msg}
                    </span>
                )}
            </div>
            <div>
                <label>
                    Пароль
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                {errors.find(error => error.path === 'password') && (
                    <span style={{ color: 'red' }}>
                        {errors.find(error => error.path === 'password').msg}
                    </span>
                )}
            </div>
            {errors.find(error => error.message) && (
                    <span style={{ color: 'red' }}>
                        {errors.find(error => error.message).message}
                    </span>
                )}
            <button type="submit">Войти</button>
        </form>
    );
};

export {LoginForm};