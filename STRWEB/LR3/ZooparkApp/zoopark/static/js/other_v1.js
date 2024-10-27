// Базовый класс
function Substance(name) {
    this.name = name;
}

// Геттеры и сеттеры
Substance.prototype.getName = function() {
    return this.name;
};

// Метод вывода на страницу
Substance.prototype.display = function() {
    return `Название: ${this.getName()}`;
};

// Класс-наследник
function Material(name, density, conductivity) {
    Substance.call(this, name);
    this.density = density;
    this.conductivity = conductivity;
}

// Наследование
Material.prototype = Object.create(Substance.prototype);
Material.prototype.constructor = Material;

// Метод для вывода только полупроводников
Material.prototype.isSemiconductor = function() {
    return this.conductivity.toLowerCase().trim() === 'полупроводник';
};

Material.prototype.getFullString = function(){
    return `${this.display()}` + `, удельный вес: ${this.density}` + `, проводимость: ${this.conductivity}`;
}

Material.prototype.getDensity = function() {
    return this.density;
};

Material.prototype.setDensity = function(density) {
    this.density = density;
};

Material.prototype.getConductivity = function() {
    return this.conductivity;
};

let materials = [
    new Material('Вода', 1, 'диэлектрик'),
    new Material('Кремний', 2.33, 'полупроводник'),
    new Material('Германий', 5.32, 'Полупроводник'),
    new Material('Медь', 8.96, 'проводник')
];

let getSemiconductors = function(){
    const semiconductors = materials.filter(s => s.isSemiconductor());
    let semiconductorsList = document.getElementById('semiconductors-list');
    semiconductorsList.innerHTML = '';
    semiconductors.forEach(s => {
        let div = document.createElement('div')
        div.textContent = s.getFullString();
        semiconductorsList.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded',()=>{
    let materialList = document.getElementById('materials-list');
    materialList.innerHTML = '';
    for(let material in materials ){
        let div = document.createElement('div')
        div.textContent = materials[material].getFullString();
        materialList.appendChild(div);
    }
    getSemiconductors();
});

document.querySelector('#form-materials').addEventListener('submit', (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    // Получаем данные из формы
    const name = document.getElementById('material-name').value.trim();
    const conductivity = document.getElementById('material-conductivity').value.trim();
    const density = parseFloat(document.getElementById('material-density').value);


    if(name && conductivity){
        const newMaterial = new Material(name, density, conductivity);
    
        materials.push(newMaterial);

        let materialList = document.getElementById('materials-list');
        let div = document.createElement('div');
            div.textContent = newMaterial.getFullString();
            materialList.appendChild(div);

        getSemiconductors(); // Обновляем список полупроводников
    }
    document.getElementById('form-materials').reset();
});

