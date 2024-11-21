import React, { useState } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../utils/AuthContext';
import { Navigate } from 'react-router-dom';
import "./Registration.css";

const RegistrationForm = () => {
    const { token, saveToken } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        photo: null,
    });
    const [errors, setErrors] = useState([]);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const usernameRegex = /^.{3,15}$/; 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value,
        }));
        setErrors([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = [];

        if (!usernameRegex.test(formData.username)) {
            validationErrors.push({ path: 'username', msg: 'Ник пользователя должен содержать от 3 до 15 символов.' });
        }

        if (!emailRegex.test(formData.email)) {
            validationErrors.push({ path: 'email', msg: 'Неверный формат почты.' });
        }

        if (!passwordRegex.test(formData.password)) {
            validationErrors.push({ path: 'password', msg: 'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры.' });
        }

        if (formData.password !== formData.confirmPassword) {
            validationErrors.push({ path: 'confirmPassword', msg: 'Пароли не совпадают.' });
        }

        if (formData.avatarUrl && !/^https?:\/\/.+\..+/.test(formData.avatarUrl)) {
            validationErrors.push({ path: 'avatarUrl', msg: 'Неверная ссылка на аватарку.' });
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (formData.photo) {
            const formDataToUpload = new FormData();
            formDataToUpload.append('image', formData.photo);
            
            axios.post('/upload', formDataToUpload, { withCredentials: true })
            .then(res => {
                const avatarUrl = res.data.url;
                const registrationData = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    avatarUrl,
                };
                axios.post('/auth/register', registrationData, { withCredentials: true })
                    .then(res => {
                        saveToken(res.data.token);
                    })
                    .catch(error => {
                        if (error.response && error.response.status === 409) {
                            setErrors(error.response.data);
                        } else {
                            console.error(error);
                        }});
                console.log(formData);
            }) 
            .catch (error => {
                console.error(error);
                setErrors(prev => [...prev, { msg: 'Ошибка при загрузке изображения.' }]);
                return;
            });
        }
        else{
            const registrationData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            };
            axios.post('/auth/register', registrationData, { withCredentials: true })
                .then(res => {
                    saveToken(res.data.token);
                })
                .catch(error => {
                    if (error.response && error.response.status === 409) {
                        setErrors(error.response.data);
                    } else {
                        console.error(error);
                    }});
        }
    };

    if(token){
        return <Navigate to='/'/>
    }

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div>
                <label>
                    Имя
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </label>
                {errors.find(error => error.path === 'username') && (
                    <span style={{ color: 'red' }}>
                        {errors.find(error => error.path === 'username').msg}
                    </span>
                )}
            </div>
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
            <div>
                <label>
                    Подтверждение пароля
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </label>
                {errors.find(error => error.path === 'confirmPassword') && (
                    <span style={{ color: 'red' }}>
                        {errors.find(error => error.path === 'confirmPassword').msg}
                    </span>
                )}
            </div>
            <div>
                <label>
                    Фото
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </label>
                {errors.find(error => error.path === 'avatarUrl') && (
                    <span style={{ color: 'red' }}>
                        {errors.find(error => error.path === 'avatarUrl').msg}
                    </span>
                )}
            </div>
            {errors.find(error => error.message) && (
                    <span style={{ color: 'red' }}>
                        {errors.find(error => error.message).message}
                    </span>
                )}
            <button type="submit">Регистрация</button>
        </form>
    );
};

export {RegistrationForm};