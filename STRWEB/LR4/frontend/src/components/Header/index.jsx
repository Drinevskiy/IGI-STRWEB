import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import axios from '../../utils/axios';
// import useToken from '../../utils/auth';
import { useAuth } from '../../utils/AuthContext';

const logo = "/icons/logo.png";

export const Header = () => {
  const { token, clearToken } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    if(window.confirm("Вы действительно хотите выйти?")){
      axios.post('/auth/logout',{}, { withCredentials: true })
            .then(res => {
                clearToken();
                navigate('/'); 
                // setToken(res.data.token);
            })
            .catch(error => {console.error(error)});
      
    }
  };
  return (
    <div className="root-header">
        {/* <div className="inner"> */}
          <a className="logo" href="/">
            <img src={logo}/>
            {/* <div>Каталог</div> */}
          </a>
          <div className="nav">
            <Link to="news">Новости</Link>
            <Link to="partners">Спонсоры</Link>
            <Link to="apis">API</Link>
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
        {/* </div> */}
    </div>
  );
};