let sortDirection = {
    lastName: true,
    firstName: true,
    position: true,
    description: true,
    salary: true,
    email: true,
    phone: true
};
// Сортировка по столбцам
function sortTable(columnIndex) {
    const table = document.querySelector('.table-employees tbody');
    const rows = Array.from(table.rows);
    const headerCells = document.querySelectorAll('.table-employees th span.sort-arrow');
    
    // Определяем название столбца для использования в объекте sortDirection
    const columnNames = ['lastName', 'firstName', 'position', 'description', 'salary', 'email', 'phone'];
    const columnName = columnNames[columnIndex - 2];
    
    // Сортируем строки
    const sortedRows = rows.sort((a, b) => {
        const aText = a.cells[columnIndex].innerText;
        const bText = b.cells[columnIndex].innerText;

        if (columnName === 'salary') {
            return sortDirection[columnName] ? aText - bText : bText - aText;
        }
        
        return sortDirection[columnName] ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });

    // Переключаем направление сортировки
    sortDirection[columnName] = !sortDirection[columnName];

    // Обновляем стрелочки
    headerCells.forEach(cell => cell.innerHTML = '');

    if (sortDirection[columnName]) {
        document.getElementById(columnName + 'Arrow').innerHTML = '▲'; // Вверх
    } else {
        document.getElementById(columnName + 'Arrow').innerHTML = '▼'; // Вниз
    }

    // Обновляем таблицу
    table.innerHTML = '';
    sortedRows.forEach(row => table.appendChild(row));
}


const itemsPerPage = 3;
let currentPage = 1;
let totalPages = 1;
let employees = [];
let positions = [];
let ui_employees = [];
let rewardedEmployees = [];
// Получение всех сотрудников
function loadEmployees(){
    document.getElementById('preloader').style.display = 'block';
    setTimeout(()=>{
        fetch('../api/employees')
        .then(response => {
            if (!response.ok) {
                throw new Error('Сеть ответила с ошибкой: ' + response.status);
            }
            return response.json();
        })
        .then(my_employees => {
        employees = my_employees;
        ui_employees = employees;
        totalPages = Math.ceil(employees.length / itemsPerPage);
        //   console.log(my_employees); // Теперь у вас есть массив животных
            displayEmployees(currentPage); // Вызов функции для отображения животных
        
        })
        .catch(error => console.error('Ошибка:', error))
        .finally(() => {
            // Скрыть прелоадер после завершения загрузки
            document.getElementById('preloader').style.display = 'none';
        });
    },500);
}

function loadPositions(){
    fetch('../api/positions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Сеть ответила с ошибкой: ' + response.status);
            }
            return response.json();
        })
        .then(my_positions => {
            positions = my_positions;
            const positionSelect = document.getElementById('position');
            positions.forEach(position => {
                const option = document.createElement('option');
                option.value = position.name; // Или другое уникальное значение
                console.log(option.value);
                option.textContent = position.name; // Текст должности
                positionSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Ошибка:', error))
}

document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();
    loadPositions();
    checkForm();
});
// Отображение ткущих сотрудников в таблицу
function displayEmployees(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const employeesTableBody = document.querySelector('.table-employees tbody');
    employeesTableBody.innerHTML = ""; // Очистить контейнер
    currentEmployees = ui_employees.slice(startIndex, endIndex);
    currentEmployees.forEach(item => {
        const row = document.createElement('tr');
        const isChecked = rewardedEmployees.some(emp => emp.username === item.username);
        row.innerHTML = `
            <td><input type="checkbox" id="employee_${ item.username }" ${isChecked ? 'checked' : ''}></td>
            <td class="td-with-image"><img src="${item.image}"></td>
            <td>${ item.last_name }</td>
            <td>${ item.first_name }</td>
            <td>${ item.position }</td>
            <td>${ item.description }</td>
            <td>${ item.salary }</td>
            <td>${ item.email }</td>
            <td>${ item.phone }</td>
        `;

        const checkbox = row.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                rewardedEmployees.push({
                    username: item.username, 
                    fullName: `${item.last_name} ${item.first_name}`
                }); // Добавляем в массив, если чекбокс отмечен
            } else {
                rewardedEmployees = rewardedEmployees.filter(emp => emp.username !== item.username);
            }
        });
        // Добавляем обработчик события для клика на строку
        row.addEventListener('click', (event) => {
            if (event.target.tagName !== 'INPUT') {
                showEmployeeDetails(item);
            }
        });

        employeesTableBody.appendChild(row);
        
    });
    
    updatePagination();
    updateButtons();
    }


function updatePagination(){
    const pagination = document.getElementById('employeePagination');
    while(pagination.children.length > 2){
        pagination.removeChild(pagination.children[1]);
    }
    if (totalPages) {
        for (let i = 0; i < totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = `${i + 1}`;
            if(i === currentPage - 1){
                button.classList.add('active');
            }  
            button.addEventListener('click', () => { 
                currentPage = i + 1;
                displayEmployees(currentPage);
            });
            pagination.insertBefore(button, document.getElementById('nextPagination'));
        }
    }
}

function updateButtons() {
    if(ui_employees.length === 0){
        document.getElementById('prevPagination').disabled = true;
        document.getElementById('nextPagination').disabled = true;
    }
    else{    
        document.getElementById('prevPagination').disabled = currentPage === 1;
        document.getElementById('nextPagination').disabled = currentPage === Math.ceil(ui_employees.length / itemsPerPage);
    }   
}

document.getElementById('prevPagination').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayEmployees(currentPage);
    }
});

document.getElementById('nextPagination').addEventListener('click', () => {
    if (currentPage < Math.ceil(employees.length / itemsPerPage)) {
        currentPage++;
        displayEmployees(currentPage);
    }
});


// Фильтрация
let filteredEmployees = []; // Для хранения отфильтрованных сотрудников

document.getElementById('filterButton').addEventListener('click', () => {
    const filterText = document.getElementById('filterInput').value.toLowerCase();
    filterEmployees(filterText);
});

function filterEmployees(filterText) {
    if (filterText) {
        filteredEmployees = employees.filter(employee => 
            employee.first_name.toLowerCase().includes(filterText) ||
            employee.last_name.toLowerCase().includes(filterText) ||
            employee.position.toLowerCase().includes(filterText) ||
            employee.description.toLowerCase().includes(filterText) ||
            employee.email.toLowerCase().includes(filterText) ||
            employee.phone.includes(filterText)
        );
    } else {
        filteredEmployees = employees; // Если фильтр пуст, возвращаем всех сотрудников
    }
    ui_employees = filteredEmployees;
    totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    currentPage = 1; // Сбросить текущую страницу на 1
    let employeeDetails = document.getElementById('employeeDetails');
    employeeDetails.innerHTML = '';
    displayEmployees(currentPage);
}

// Подробнее о сотруднике
function showEmployeeDetails(employee) {
    let employeeDetails = document.getElementById('employeeDetails');
    employeeDetails.innerHTML = '';
    employeeDetails.innerHTML = `
        <img id="detailImage" src="${employee.image}" alt="">
            <div class="contact-info">
            <h2 id="detailFullName">${employee.last_name} ${employee.first_name}</h2>
            <hr/>
            <p><span>Телефон:</span> ${employee.phone}</p>
            <p><span>Почта:</span> ${employee.email}</p>
            <p><span>Должность:</span> ${employee.position}</p>
            <p><span>Обязанности:</span> ${employee.description}</p>
            <p><span>Зарплата:</span> ${employee.salary}</p>
        </div>
    `;
}


// Премировать
document.getElementById('rewardButton').addEventListener('click', () => {
    // Генерируем текст для отображения
    
    if (rewardedEmployees.length > 0) {
        const rewardedNames = rewardedEmployees.map(emp => emp.fullName);
        const rewardText = `В этом месяце премию заработали: ${rewardedNames.join(', ')}.`;
        document.getElementById('rewardText').innerText = rewardText;
        rewardedEmployees = [];
    } else {
        document.getElementById('rewardText').innerText = 'В этом месяце никто не заработал премию.';
        // document.getElementById('rewardMessage').style.display = 'none'; // Скрываем сообщение, если нет выбранных сотрудников
    }
    document.getElementById('rewardMessage').style.display = 'block'; // Показываем сообщение
    displayEmployees(currentPage);
});

document.getElementById('addButton').addEventListener('click', () => {
    document.getElementById('formContainer').style.display = 'block';
});

document.getElementById('employeeForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Предотвращаем отправку формы

    const blogUrl = document.getElementById('blogUrl').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const validationMessage = document.getElementById('validationMessage');

    // Проверка валидности URL
    const urlPattern = /^(http:\/\/|https:\/\/).+\.(php|html)$/;
    const isValidUrl = urlPattern.test(blogUrl);

    // Проверка валидности телефона
    const phonePattern = /(\+375\s?\((29|17|33|44)\)\s?\d{3}[- ]?\d{2}[- ]?\d{2}|\+375\s?(29|17|33|44)\s?\d{3}[- ]?\d{2}[- ]?\d{2}|(8\s?\(0(29|17|33|44)\)\s?\d{3}[- ]?\d{2}[- ]?\d{2}|8\s?0(29|17|33|44)\s?\d{3}[- ]?\d{2}[- ]?\d{2}))/;
    // const isValidPhone = phonePattern.test(phone.replace(/\s/g, '').replace(/[-]/g, ''));
    const isValidPhone = phonePattern.test(phone);

    const emailPattern = /^.+@.+\..+$/;
    const isValidEmail = emailPattern.test(email);
    // Сброс ошибок
    document.getElementById('blogUrl').classList.remove('error');
    document.getElementById('phone').classList.remove('error');
    document.getElementById('email').classList.remove('error');
    validationMessage.textContent = '';

    // Проверка и вывод сообщений
    if (!isValidUrl) {
        document.getElementById('blogUrl').classList.add('error');
        validationMessage.textContent += 'Неверный URL. Должен начинаться с http:// или https:// и заканчиваться на .php или .html.\n';
    }

    if (!isValidPhone) {
        document.getElementById('phone').classList.add('error');
        validationMessage.textContent += 'Неверный номер телефона. Должен быть в формате: 80291112233, 8 (029) 1112233, +375 (29) 111-22-33 или +375 (29) 111 22 33.\n';
    }
    if (!isValidEmail) {
        document.getElementById('email').classList.add('error');
        validationMessage.textContent += 'Неверная почта. Должна быть в формате: drinevskiy@gmail.com.\n';
    }

    // Если все валидно, можно отправить данные или выполнить другие действия
    if (isValidUrl && isValidPhone && isValidEmail) {
        // Здесь вы можете добавить логику для сохранения данных
        // alert('Данные успешно сохранены!');
        addEmployee();
        document.getElementById('formContainer').style.display = 'none'; // Скрыть форму
    }
});

function addEmployee(){
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const blogUrl = document.getElementById('blogUrl').value;
    const position = document.getElementById('position').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    // Создаем объект данных
    const employeeData = {
        last_name: lastName,
        first_name: firstName,
        position: position,
        phone: phone,
        email: email
    };

    // Отправляем данные на сервер
    fetch('/add-employee/', {  // Убедитесь, что URL соответствует вашему маршруту
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Получите CSRF токен
        },
        body: JSON.stringify(employeeData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.message);
            loadEmployees();
            // Здесь можете также обновить таблицу или выполнить другие действия
        }
    })
    .catch(error => console.error('Ошибка:', error));
}

function checkForm(){
    const form = document.getElementById('employeeForm');
    const submitButton = document.getElementById('submitButton');

    function toggleSubmitButton() {
        // Проверяем, все ли поля заполнены
        const isFormValid = Array.from(form.elements).every(input => {
            return input.checkValidity();
        });
        // Включаем или отключаем кнопку в зависимости от валидности формы
        submitButton.disabled = !isFormValid;
    }

    // Добавим обработчик событий на все поля ввода
    form.addEventListener('input', toggleSubmitButton);
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Проверка на наличие нужного cookie
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}