
const fox = document.getElementById('fox');
const palmRight = document.getElementById('palm_right');
const palmLeft = document.getElementById('palm_left');
const monkey = document.getElementById('monkey');

fox.style.setProperty('top', '260px');
fox.style.setProperty('right', '400px');
palmRight.style.right = '0px';
palmLeft.style.left = '0px';
monkey.style.setProperty('right','0');
window.addEventListener('scroll', () => {
    let currentScrollY = scrollY;
    fox.style.top = `${260 + currentScrollY/1.8}px`
    fox.style.right = `${400 - currentScrollY/10}px`
    palmRight.style.right = `-${currentScrollY/3}px`;
    palmLeft.style.left = `-${currentScrollY/3}px`;
    monkey.style.right = `${currentScrollY/0.5}px`;
});

const targetScrollY = 850; // Целевая высота прокрутки
const duration = 2500; // Длительность прокрутки в миллисекундах
const start = window.scrollY; // Начальная позиция
const change = targetScrollY - start; // Изменение высоты
const startTime = performance.now(); // Время начала прокрутки

function animateScroll(currentTime) {
    const elapsed = currentTime - startTime; // Время, прошедшее с начала
    const progress = Math.min(elapsed / duration, 1); // Прогресс (от 0 до 1)

    // Вычисляем текущее значение прокрутки
    const easeInOutQuad = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
    const currentScrollY = start + change * easeInOutQuad;

    window.scrollTo(0, currentScrollY); // Прокручиваем страницу

    if (progress < 1) {
        requestAnimationFrame(animateScroll); // Продолжаем анимацию
    }
}

// Запускаем анимацию прокрутки при загрузке страницы
window.addEventListener('load', () => {
    if(start<=targetScrollY){
        requestAnimationFrame(animateScroll);
    }
});