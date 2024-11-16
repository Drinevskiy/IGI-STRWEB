import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Header.css";
// import useToken from '../../utils/auth';
import { useAuth } from '../../utils/AuthContext';

export const Header = () => {
  const { token, clearToken } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    if(window.confirm("Вы действительно хотите выйти?")){
      clearToken();
      navigate('/'); 
    }
  };
  return (
    <div className="root-header">
        <div className="inner">
          <a className="logo" href="/">
            <div>Каталог</div>
          </a>
          <div className="nav">
            <Link to="news">Новости</Link>
            <Link to="partners">Спонсоры</Link>
          </div>
          <div className="buttons">
            {!token ? (
              <>
                <Link to="/login">Войти</Link>
                <Link to="/registration">Регистрация</Link>
              </>
            ) : (
              <>
                <button onClick={handleLogout}>Выйти</button> 
                <Link to="/profile">Профиль</Link>
              </>

            )}
          </div>
        </div>
    </div>
  );
};