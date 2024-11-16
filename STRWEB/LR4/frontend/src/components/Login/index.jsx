import React, { useState } from 'react';
// import './Login.css'; // Import the CSS file

const LoginForm = () => {
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
        console.log(formData);
    };

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