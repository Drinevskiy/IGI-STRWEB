// Базовый класс
class Substance {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    display() {
        return `Название: ${this.getName()}`;
    }
}

// Класс-наследник
class Material extends Substance {
    constructor(name, density, conductivity) {
        super(name); // Вызов конструктора родительского класса
        this.density = density;
        this.conductivity = conductivity;
    }

    isSemiconductor() {
        return this.conductivity.toLowerCase().trim() === 'полупроводник';
    }

    getFullString() {
        return `${this.display()}, удельный вес: ${this.density}, проводимость: ${this.conductivity}`;
    }

    getDensity() {
        return this.density;
    }

    setDensity(density) {
        this.density = density;
    }

    getConductivity() {
        return this.conductivity;
    }
}

let materials = [
    new Material('Вода', 1, 'диэлектрик'),
    new Material('Кремний', 2.33, 'полупроводник'),
    new Material('Германий', 5.32, 'полупроводник'),
    new Material('Медь', 8.96, 'проводник')
];

class WareHouse{
    constructor(materials){
        this.materials = materials;
    }

    loadSemiconductors = function() {
        const semiconductors = this.materials.filter(s => s.isSemiconductor());
        let semiconductorsList = document.getElementById('semiconductors-list');
        semiconductorsList.innerHTML = '';
        semiconductors.forEach(s => {
            let div = document.createElement('div');
            div.textContent = s.getFullString();
            semiconductorsList.appendChild(div);
        });
    }

    loadAllMaterials = function(){
        let materialList = document.getElementById('materials-list');
        materialList.innerHTML = '';
        this.materials.forEach(material => {
            let div = document.createElement('div');
            div.textContent = material.getFullString();
            materialList.appendChild(div);
        });
        this.loadSemiconductors();
    }

    addMaterial(){
        // Получаем данные из формы
        const name = document.getElementById('material-name').value.trim();
        const conductivity = document.getElementById('material-conductivity').value.trim();
        const density = parseFloat(document.getElementById('material-density').value);

        // Проверка на наличие имени и проводимости
        if (name && conductivity) {
            const newMaterial = new Material(name, density, conductivity);
            this.materials.push(newMaterial);

            let materialList = document.getElementById('materials-list');
            let div = document.createElement('div');
            div.textContent = newMaterial.getFullString();
            materialList.appendChild(div);

            this.loadSemiconductors(); // Обновляем список полупроводников
        }

        document.getElementById('form-materials').reset(); // Очищаем форму
    }
}

let warehouse = new WareHouse(materials);

warehouse.loadAllMaterials();
warehouse.loadSemiconductors();

// Обработка отправки формы
document.querySelector('#form-materials').addEventListener('submit', (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    warehouse.addMaterial();
});