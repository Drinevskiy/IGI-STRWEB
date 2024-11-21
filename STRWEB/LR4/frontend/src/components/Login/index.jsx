import React, { useState } from 'react';
import axios from '../../utils/axios';
import { Navigate } from 'react-router-dom';
import './Login.css'
import { useAuth } from '../../utils/AuthContext';

const google_logo = "/icons/google_logo.png";
const facebook_logo = "/icons/facebook_logo.png";
const twitter_logo = "/icons/twitter_logo.png";


const LoginForm = () => {
    const { token, saveToken } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState([]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; 

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

        if (!emailRegex.test(formData.email)) {
            validationErrors.push({ path: 'email', msg: 'Неверный формат email.' });
        }

        if (!passwordRegex.test(formData.password)) {
            validationErrors.push({ path: 'password', msg: 'Пароль должен содержать минимум 8 символов, включая заглавные буквы, строчные буквы и цифры.' });
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios.post('/auth/login', formData, { withCredentials: true })
            .then(res => {
                saveToken(res.data.token);
            })
            .catch(error => {
                if (error.response && error.response.status === 400 || error.response.status === 404) {
                    setErrors(error.response.data);
                } else {
                    console.error(error);
                }});
    };

    function loginWithGoogle(){
        window.open('http://localhost:5000/auth/google', '_self');
    }
    
    function loginWithFacebook(){
        window.open('http://localhost:5000/auth/facebook', '_self');
    }

    function loginWithTwitter(){
        window.open('http://localhost:5000/auth/twitter', '_self');
    }

    if(token){
        return <Navigate to='/'/>
    }
    return (
        <>
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
            <div className='auth-services'>
            <button className='google' onClick={loginWithGoogle}>
                <img src={google_logo}></img>
                <p>Войти с помощью Google</p>
            </button>
            {/* <button className='facebook' onClick={loginWithFacebook}>
                <img src={facebook_logo}></img>
                <p>Войти с помощью Facebook</p>
            </button> */}
            <button className='twitter' onClick={loginWithTwitter}>
                <img src={twitter_logo}></img>
                <p>Войти с помощью Twitter</p>
            </button>
        </div>
        </>
    );
};

export {LoginForm};