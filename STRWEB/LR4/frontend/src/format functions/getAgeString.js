export default function getAgeString(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Если день рождения еще не наступил в текущем году, уменьшаем возраст на 1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    // Возвращаем строку с правильным склонением
    return age === 1 ? `${age} год` : age < 5 ? `${age} года` : `${age} лет`;
}
