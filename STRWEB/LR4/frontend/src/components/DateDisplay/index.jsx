import React, { useState, useEffect } from 'react';
import getDateInfo from '../../format functions/getDateInfo';

const DateDisplay = () => {
  const [userTimeZone, setUserTimeZone] = useState('');
  const [userDate, setUserDate] = useState('');
  const [utcDate, setUtcDate] = useState('');

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimeZone(timeZone);
    
    // Обновляем дату каждый раз, когда компонент рендерится
    const updateDate = () => {
      const now = new Date();
      const {userTime, utcTime} = getDateInfo(now);
      setUserDate(userTime);
      setUtcDate(utcTime);
    };

    updateDate();
    
    // Обновляем дату каждую секунду
    const intervalId = setInterval(updateDate, 1000);
    return () => clearInterval(intervalId); // Очистка интервала при размонтировании
  }, []);

  return (
    <div>
      <h2>Текущая дата и время</h2>
      <p><strong>Временная зона пользователя:</strong> {userTimeZone}</p>
      <p><strong>Текущая дата и время (пользовательская):</strong> {userDate}</p>
      <p><strong>Текущая дата и время (UTC):</strong> {utcDate}</p>
    </div>
  );
};

export {DateDisplay};