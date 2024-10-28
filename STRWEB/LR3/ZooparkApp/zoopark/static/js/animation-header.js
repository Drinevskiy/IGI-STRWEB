const snake = document.getElementById('anim-snake');

    // Переменные для анимации
    let snakeSpeed = 2; // Скорость перемещения змеи (пикселей за шаг)
    let snakePositionX = -300; // Начальная позиция змеи по X (за пределами экрана)
    let snakeAmplitude = 25; // Амплитуда движения змеи по Y (высота волны)
    let snakeFrequency = 60; // Скорость колебаний по Y (чем больше число, тем медленнее волна)
    const headerWidth = document.querySelector('header').offsetWidth; // Ширина header

    // Функция для перемещения змеи
    function moveSnake() {
      // Увеличиваем позицию змеи по X
      snakePositionX += snakeSpeed;

      // Рассчитываем новое положение по Y на основе синусоиды
      let snakePositionY = Math.sin(snakePositionX / snakeFrequency) * snakeAmplitude;
      
      // Применяем новые координаты змеи
      snake.style.left = snakePositionX + 'px';
      snake.style.top = `${snakePositionY - 10}px`; // 50% + смещение по синусоиде

      // Если змея скрылась за правым краем header, возвращаем ее на левый край
      if (snakePositionX > headerWidth + 200) {
        snakePositionX = -300; // Возвращаем змею на левый край
        
    }
      // Запускаем анимацию снова через 10 мс
      requestAnimationFrame(moveSnake);
    }

    // Запускаем анимацию при загрузке страницы
    moveSnake();