import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../utils/AuthContext';
import './Profile.css';
import { DateDisplay } from '../DateDisplay';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const { token } = useAuth();
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // Валидация пароля

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        });
        setUser(response.data);

        const avatar = response.data.avatarUrl ? response.data.avatarUrl : 'uploads/avatarka.jpg';
        const avatarResponse = await axios.get(avatar, { responseType: 'blob' });
        const avatarUrl = URL.createObjectURL(avatarResponse.data);
        setAvatar(avatarUrl);
      } catch (error) {
        console.error('Ошибка при получении профиля:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handlePasswordChange = async () => {
    setErrors([]); // Сбрасываем ошибки перед новой валидацией
    const validationErrors = [];

    // Валидация нового пароля
    if (!passwordRegex.test(newPassword)) {
      validationErrors.push({ path: 'newPassword', msg: 'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры.' });
    }

    // Проверка совпадения паролей
    if (newPassword !== confirmPassword) {
      validationErrors.push({ path: 'confirmPassword', msg: 'Пароли не совпадают.' });
    }

    // Если есть ошибки валидации, устанавливаем их и прерываем выполнение
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch('/auth/profile', {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage(response.data.message); // Успех от сервера
      setErrors([]); // Сбрасываем сообщения об ошибках
      // Сбрасываем поля ввода
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors([{ msg: error.response.data.message }]); // Устанавливаем сообщение об ошибке от сервера
      } else {
        setErrors([{ msg: 'Ошибка при изменении пароля.' }]); // Общая ошибка
      }
      setSuccessMessage(''); // Сбрасываем сообщение об успехе
      console.error('Ошибка при изменении пароля:', error);
    }
  };

  if(!token){
    return <Navigate to='/login'/>
  }

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        {avatar && <img className="profile-avatar" src={avatar} alt={user.username} />}
        <h1 className="profile-nickname">{user.username}</h1>
        <p className="profile-email">{user.email}</p>
      </div>
      <DateDisplay/>
      <div className="profile-content">
        <h2>Изменение пароля</h2>
        {errors.map((error, index) => (
          <div key={index} className='error-message'>
            {error.msg}
          </div>
        ))}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form className="password-form">
          <div className="form-group">
            <label htmlFor="old-password">Старый пароль:</label>
            <input
              type="password"
              id="old-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">Новый пароль:</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Подтверждение нового пароля:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="button" className="password-change-btn" onClick={handlePasswordChange}>
            Изменить пароль
          </button>
        </form>
      </div>
    </div>
  );
};

export { Profile };