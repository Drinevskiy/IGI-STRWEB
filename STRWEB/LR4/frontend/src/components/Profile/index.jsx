import React, { useState } from 'react';
import './Profile.css';

// const Profile = ({ user }) => {
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handlePasswordChange = () => {
//     // Здесь можно добавить логику для изменения пароля
//     console.log('Изменение пароля:', { oldPassword, newPassword, confirmPassword });
//   };

//   return (
//     <div className="profile-page">
//       <div className="profile-header">
//         <img className="profile-avatar" src={user.avatarUrl} alt={user.nickname} />
//         <h1 className="profile-nickname">{user.nickname}</h1>
//         <p className="profile-email">{user.email}</p>
//       </div>
//       <div className="profile-content">
//         <h2>Изменение пароля</h2>
//         <form className="password-form">
//           <div className="form-group">
//             <label htmlFor="old-password">Старый пароль:</label>
//             <input
//               type="password"
//               id="old-password"
//               value={oldPassword}
//               onChange={(e) => setOldPassword(e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="new-password">Новый пароль:</label>
//             <input
//               type="password"
//               id="new-password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="confirm-password">Подтверждение нового пароля:</label>
//             <input
//               type="password"
//               id="confirm-password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//           </div>
//           <button type="button" className="password-change-btn" onClick={handlePasswordChange}>
//             Изменить пароль
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
const Profile = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const handlePasswordChange = () => {
      // Здесь можно добавить логику для изменения пароля
      console.log('Изменение пароля:', { oldPassword, newPassword, confirmPassword });
    };
  
    return (
      <div className="profile-page">
        <div className="profile-header">
          <img className="profile-avatar" src="https://stekloinstrument.ru/image/avatarka.png" alt="\" />
          <h1 className="profile-nickname">Username</h1>
          <p className="profile-email">user@gmail.com</p>
        </div>
        <div className="profile-content">
          <form className="password-form">
            <div className="form-group">
              <label htmlFor="old-password">Старый пароль:</label>
              <input
                type="password"
                id="old-password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">Новый пароль:</label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Подтверждение нового пароля:</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

export {Profile};