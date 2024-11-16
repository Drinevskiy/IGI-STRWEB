import React from "react";

// import vk from "/icons/vk_logo.png";
// import instagram from "/icons/instagram_logo.png";
// import youtube from "/icons/youtube_logo.png";
import "./Footer.css";

const vk = "/icons/vk_logo.png";
const instagram = "/icons/instagram_logo.png";
const youtube = "/icons/youtube_logo.png";
const logo = "/icons/logo.png";

export const Footer = () => {
  return (
    <footer>
      <div class="copyright">
          <span><img src={logo}/></span>
          <p>© 2024 Kirad, Inc. <br/>All rights reserved.</p>
      </div>
      <div class="links">
        <a href="https://www.youtube.com/channel/UCRWCw25KZqqxu5OVeb37hEA" target="_blank">
            <img src={youtube}/>
        </a>
        <a href="https://vk.com/id208792228" target="_blank">
            <img src={vk}/>
        </a>
        <a href="https://www.instagram.com/kira_dri/" target="_blank">
            <img src={instagram}/>
        </a>
      </div>
        {/* <div className="inner">
          <a className="logo" href="/">
            <div>Aniland</div>
          </a>
          <div className="buttons">
            <button>Войти</button>
            <button>Регистрация</button>
          </div>
        </div> */}
    </footer>
  );
};