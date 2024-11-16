// export function setToken(userToken){
//     sessionStorage.setItem('token', userToken);
// };

// export function getToken() {
//     const tokenString = sessionStorage.getItem('token');
//     // const userToken = JSON.parse(tokenString);
//     return tokenString;
//     // return userToken?.token;
//   }
import { useState } from 'react';
export default function useToken() {
  const getToken = () => {
    return localStorage.getItem('token');
  };
  const [token, setToken] = useState(getToken());
  const saveToken = userToken => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };
  const clearToken = () => {
    localStorage.removeItem('token');
    setToken(null); // Обнуляем состояние
  };
  return {
    setToken: saveToken,
    clearToken,
    token
  }
}