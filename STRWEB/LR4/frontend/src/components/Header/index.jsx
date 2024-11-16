import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export const Header = () => {
  let isAuth = true;
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
            {!isAuth ? (
              <>
                <Link to="/login">Войти</Link>
                <Link to="/registration">Регистрация</Link>
              </>
            ) : (
              <>
                <Link to="/logout">Выйти</Link> 
                <Link to="/profile">Профиль</Link>
              </>

            )}
          </div>
        </div>
    </div>
  );
};