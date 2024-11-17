export default function getDateInfo(isoDate){
    // Получаем временную зону пользователя
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
    // Создаём объект даты из строки ISO
    const date = new Date(isoDate);
  
    // Получаем локальное время по временной зоне пользователя
    const userTime = date.toLocaleString('ru-RU', { timeZone });
    
    // Получаем UTC время
    const utcTime = date.toLocaleString('ru-RU', { timeZone: "UTC" }); // Время в формате ISO 8601 для UTC
  
    return {
      timeZone,
      userTime,
      utcTime,
    };
  };

  