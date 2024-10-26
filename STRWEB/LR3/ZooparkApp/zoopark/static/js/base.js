const countdownDisplay = document.getElementById('timer');
const totalTime = 3600;
let remainingTime;

// Проверяем, есть ли оставшееся время в localStorage
if (localStorage.getItem('remainingTime')) {
    remainingTime = parseInt(localStorage.getItem('remainingTime'), 10);
} else {
    // Если нет, устанавливаем новое время
    remainingTime = totalTime;
    localStorage.setItem('remainingTime', remainingTime);
}

// Функция для обновления отображения времени
function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    countdownDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Функция для обратного отсчета
function countdown() {
    if (remainingTime > 0) {
        remainingTime--;
        localStorage.setItem('remainingTime', remainingTime); // Сохраняем оставшееся время
        updateDisplay();
    } else {
        clearInterval(interval);
        localStorage.removeItem('remainingTime'); // Удаляем оставшееся время
        countdownDisplay.textContent = "Время истекло!";
    }
}

// Обновляем отображение при загрузке страницы
updateDisplay();

// Запускаем таймер
const interval = setInterval(countdown, 1000);