// Запрашиваем дату рождения у пользователя
const birthDateInput = prompt("Введите вашу дату рождения (в формате ГГГГ-ММ-ДД):");
let container = document.querySelector('#vacancies-card-container');
// Проверяем, введена ли дата
if (birthDateInput) {
    const birthDate = new Date(birthDateInput);
    const today = new Date();

    // Проверка на корректность даты
    if (isNaN(birthDate.getTime())) {
        alert("Некорректная дата. Пожалуйста, используйте формат ГГГГ-ММ-ДД.");
        container.innerHTML = '';
    } else {
        // Вычисляем возраст
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        // Учитываем, если день рождения еще не наступил в этом году
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Получаем день недели
        const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
        const dayOfWeek = daysOfWeek[birthDate.getDay()];

        // Проверка на совершеннолетие
        if (age >= 18) {
            alert(`Вы совершеннолетний. Ваша дата рождения: ${birthDate.toLocaleDateString()} - это ${dayOfWeek}.`);
            
        } else {
            alert(`Вы несовершеннолетний. Вам необходимо разрешение родителей на использование сайта. Ваша дата рождения: ${birthDate.toLocaleDateString()} - это ${dayOfWeek}.`);
            container.innerHTML = '';
        }
    }
} else {
    alert("Вы не ввели дату рождения.");
    container.innerHTML = '';
}