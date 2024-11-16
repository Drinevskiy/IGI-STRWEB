import React, { useState } from 'react';
import axios from '../../utils/axios';
import { useSelector } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
// import useToken from '../../utils/auth';
import { useAuth } from '../../utils/AuthContext';

const LoginForm = () => {
    const { token, saveToken } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here (e.g., API call)
        axios.post('/auth/login', formData)
            .then(res => {
                // console.log('isAuth');
                console.log(res.data);
                saveToken(res.data.token);
                // setToken(res.data.token);
            })
            .catch(error => {console.error(error)});
        // console.log(formData);
    };

    if(token){
        navigate('/');
        return null;
        // return <Navigate to='/'/>
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export {LoginForm};