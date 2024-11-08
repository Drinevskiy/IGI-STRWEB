class Slider{
  constructor(container) {
    this.container = container;
    this.figures = this.container.querySelectorAll('.slider figure');
    this.slidesCount = this.figures.length;
    this.slideIndex = 0;
    this.prevIndex = this.slidesCount - 1;
    this.nextIndex = this.slideIndex + 1;
    this.interval = null;
    this.mouseOverHandler = () => clearInterval(this.interval);
    this.mouseOutHandler = () => this.startAutoSlide();
    this.init();
  }
  init() {
    this.updateSlidesCount();
    this.setupControls();
    this.updatePagination();
    this.showSlide();
    this.loadCheckboxes();
    this.setupMouseEvents();
  }

  loadCheckboxes(){
    this.loop = document.getElementById('loop').checked;
    this.navs = document.getElementById('navs').checked;
    const prevButton = this.container.querySelector('.prev-button');
    const nextButton = this.container.querySelector('.next-button');
    prevButton.style.display = this.navs ? 'block' : 'none';
    nextButton.style.display = this.navs ? 'block' : 'none';

    this.pags = document.getElementById('pags').checked;
    this.updatePagination();
    this.auto = document.getElementById('auto').checked;
    this.stopMouseHover = document.getElementById('stopMouseHover').checked;
    this.delay = document.getElementById('delay').value;
    this.startAutoSlide();
  }
  setupControls() {
    const prevButton = this.container.querySelector('.prev-button');
    const nextButton = this.container.querySelector('.next-button');

    prevButton.addEventListener('click', () => this.showPreviousSlide());
    nextButton.addEventListener('click', () => this.showNextSlide());

    // const delayInput = document.getElementById('delay');
    const loopCheckbox = document.getElementById('loop');
    const navsCheckbox = document.getElementById('navs');
    const pagsCheckbox = document.getElementById('pags');
    const autoCheckbox = document.getElementById('auto');
    const stopMouseHoverCheckbox = document.getElementById('stopMouseHover');

    // delayInput.addEventListener('input', (e) => {
    //     this.delay = e.target.value;
    //     this.resetAutoSlide();
    // });

    loopCheckbox.addEventListener('change', (e) => {
        this.loop = e.target.checked;
    });

    navsCheckbox.addEventListener('change', (e) => {
        prevButton.style.display = e.target.checked ? 'block' : 'none';
        nextButton.style.display = e.target.checked ? 'block' : 'none';
    });

    pagsCheckbox.addEventListener('change', (e) => {
      this.pags = e.target.checked;
        this.updatePagination();
    });

    autoCheckbox.addEventListener('change', (e) => {
        this.auto = e.target.checked;
        this.resetAutoSlide();
    });

    stopMouseHoverCheckbox.addEventListener('change', (e) => {
        this.stopMouseHover = e.target.checked;
        this.setupMouseEvents();
    });
  }

  updateSlidesCount() {
    const slidesCount = this.container.querySelector('.slides-count');
    slidesCount.textContent = (this.slideIndex + 1) + '/' + this.slidesCount;
  }

  updatePagination() {
    const pagination = this.container.querySelector('.pagination');
    pagination.innerHTML = ''; // Clear existing pagination

    if (this.pags) {
        for (let i = 0; i < this.slidesCount; i++) {
            const button = document.createElement('div');
            if(i === this.slideIndex){
              button.classList.add('active');
            }  
            button.addEventListener('click', () => this.goToSlide(i));
            pagination.appendChild(button);
        }
    }
  }

  showSlide() {
    this.figures.forEach((slide, index) => {
      slide.classList.remove('active', 'prev', 'next');
      if (index === this.slideIndex) {
          slide.classList.add('active');
      } 
      else if (index === this.prevIndex) {
          slide.classList.add('prev');
      } 
      else if (index === this.nextIndex) {
          slide.classList.add('next');
      }
    });
    this.updateSlidesCount();
    this.updatePagination();
  }

  showNextSlide() {
    if(this.loop){
      this.slideIndex = (this.slideIndex + 1) % this.slidesCount;
      this.prevIndex = (this.slideIndex - 1 + this.slidesCount) % this.slidesCount
      this.nextIndex = (this.slideIndex + 1) % this.slidesCount;
    }
    else{
      if(this.slideIndex + 1!== this.slidesCount){
        this.prevIndex = this.slideIndex;
        this.slideIndex = this.slideIndex + 1;
        this.nextIndex = this.slideIndex + 1;
      }
    }
    this.showSlide();
  }

  showPreviousSlide() {
    if(this.loop){
      this.slideIndex = (this.slideIndex - 1 + this.slidesCount) % this.slidesCount;
      this.prevIndex = (this.slideIndex - 1 + this.slidesCount) % this.slidesCount
      this.nextIndex = (this.slideIndex + 1) % this.slidesCount;

    }
    else{
      if(this.slideIndex !== 0){
        this.slideIndex = this.slideIndex - 1;
        this.prevIndex = this.slideIndex - 1;
        this.nextIndex = this.slideIndex + 1;
        console.log(this.prevIndex);
      }
    }
    this.showSlide();
  }

  goToSlide(index) {
    if(this.loop){
      this.slideIndex = index;
      this.prevIndex = (index - 1 + this.slidesCount) % this.slidesCount
      this.nextIndex = (this.slideIndex + 1) % this.slidesCount;
    }
    else{
      if(index + 1 !== this.slidesCount){
        this.prevIndex = index;
        this.slideIndex = index + 1;
        this.nextIndex = this.slideIndex + 1;
      }
    }
    // this.slideIndex = index
    this.showSlide();
  }

  startAutoSlide() {
    if (this.auto) {
        this.interval = setInterval(() => this.showNextSlide(), this.delay);
    }
  }

  resetAutoSlide() {
    clearInterval(this.interval);
    this.startAutoSlide();
  }

  
  setupMouseEvents() {
    

    if (this.stopMouseHover) {
        this.container.addEventListener('mouseover', this.mouseOverHandler);
        this.container.addEventListener('mouseout', this.mouseOutHandler);
    } else {
        console.log('remove listener');
        // Удаляем обработчики, если stopMouseHover равно false
        this.container.removeEventListener('mouseover', this.mouseOverHandler);
        this.container.removeEventListener('mouseout', this.mouseOutHandler);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sliderContainer = document.querySelector('.slider-container');
  new Slider(sliderContainer);
});




const itemsPerPage = 4;
let currentPage = 1;
let totalPages = 1;
let animals = [];
let currentAnimals = [];
let nextAnimals = [];

fetch('/api/animals/')
    .then(response => response.json())
    .then(my_animals => {
      animals = my_animals;
      totalPages = Math.ceil(animals.length / itemsPerPage);
      console.log(my_animals); // Теперь у вас есть массив животных
      currentAnimals = animals.slice(0, itemsPerPage);
        displayAnimals(currentPage); // Вызов функции для отображения животных
      
    })
    .catch(error => console.error('Ошибка:', error));



function getAgeString(age) {
  if (age === 1) {
      return `${age} год`;
  } else if (age > 1 && age < 5) {
      return `${age} года`;
  } else {
      return `${age} лет`;
  }
}

function displayAnimals(page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const animalCardsContainer = document.getElementById('animalCardsContainer');
  animalCardsContainer.innerHTML = ""; // Очистить контейнер
  

  nextAnimals = animals.slice(startIndex, endIndex);
  const maxLength = Math.max(currentAnimals.length, nextAnimals.length);

  const combinedAnimals = Array.from({ length: maxLength }, (_, index) => {
      return[ currentAnimals[index] || 'Unknown Animal',
      nextAnimals[index] || 'Unknown Animal'];
  });
  console.log(combinedAnimals);
  combinedAnimals.forEach(animalPair => {
    const animal1 = animalPair[0]; // Первый элемент
    const animal2 = animalPair[1];
    console.log(animal2);
    if(animal1 === 'Unknown Animal'){
      animalCardsContainer.innerHTML += `
          <article>
              <div class="animal-card">
                <div class="front">
                  <img src="${animal2.image}" alt="">
                  <div class="animal-info">
                      <h2>${animal2.name}</h2>
                      <hr/>
                      <p>${animal2.description}</p> 
                      <ul class="animal-details">
                          <li><span>Вид:</span> ${animal2.type}</li>
                          <li><span>Семейство:</span> ${animal2.family}</li>
                          <li><span>Возраст:</span> ${getAgeString(animal2.age)}</li>
                          <li><span>Вольер:</span> ${animal2.aviary}</li>
                      </ul>
                  </div>
                </div>
              </div>
          </article>
      `;
    }
    else if(animal2 === 'Unknown Animal'){
      animalCardsContainer.innerHTML += `
          <article>
              <div class="animal-card">
                <div class="back">
                  <img src="${animal1.image}" alt="">
                  <div class="animal-info">
                      <h2>${animal1.name}</h2>
                      <hr/>
                      <p>${animal1.description}</p> 
                      <ul class="animal-details">
                          <li><span>Вид:</span> ${animal1.type}</li>
                          <li><span>Семейство:</span> ${animal1.family}</li>
                          <li><span>Возраст:</span> ${getAgeString(animal1.age)}</li>
                          <li><span>Вольер:</span> ${animal1.aviary}</li>
                      </ul>
                  </div>
                </div>
              </div>
          </article>
      `;
    }else{
      animalCardsContainer.innerHTML += `
          <article>
              <div class="animal-card">
                <div class="back">
                  <img src="${animal1.image}" alt="">
                  <div class="animal-info">
                      <h2>${animal1.name}</h2>
                      <hr/>
                      <p>${animal1.description}</p> 
                      <ul class="animal-details">
                          <li><span>Вид:</span> ${animal1.type}</li>
                          <li><span>Семейство:</span> ${animal1.family}</li>
                          <li><span>Возраст:</span> ${getAgeString(animal1.age)}</li>
                          <li><span>Вольер:</span> ${animal1.aviary}</li>
                      </ul>
                  </div>
                </div>
                <div class="front">
                  <img src="${animal2.image}" alt="">
                  <div class="animal-info">
                      <h2>${animal2.name}</h2>
                      <hr/>
                      <p>${animal2.description}</p> 
                      <ul class="animal-details">
                          <li><span>Вид:</span> ${animal2.type}</li>
                          <li><span>Семейство:</span> ${animal2.family}</li>
                          <li><span>Возраст:</span> ${getAgeString(animal2.age)}</li>
                          <li><span>Вольер:</span> ${animal2.aviary}</li>
                      </ul>
                  </div>
                </div>
                
              </div>
              
          </article>
      `;
  }});

  // Запускаем переворот карточек
  setTimeout(() => {
    const cards = document.querySelectorAll('.animal-card');
    cards.forEach(card => {
        card.classList.toggle('flip'); // Добавляем класс для переворота
    });
}, 200); // Задержка перед добавлением класса для плавного эффекта
  currentAnimals = nextAnimals;
  updatePagination();
  updateButtons();
}
function updatePagination(){
  const pagination = document.getElementById('animalPagination');
  while(pagination.children.length > 2){
    pagination.removeChild(pagination.children[1]);
  }
  if (totalPages) {
    console.log(totalPages);
      for (let i = 0; i < totalPages; i++) {
          const button = document.createElement('button');
          button.textContent = `${i + 1}`;
          if(i === currentPage - 1){
            button.classList.add('active');
          }  
          button.addEventListener('click', () => { 
            currentPage = i + 1;
            displayAnimals(currentPage);
          });
          pagination.insertBefore(button, document.getElementById('nextPagination'));
      }
  }
}

function updateButtons() {
  document.getElementById('prevPagination').disabled = currentPage === 1;
  document.getElementById('nextPagination').disabled = currentPage === Math.ceil(animals.length / itemsPerPage);
}

document.getElementById('prevPagination').addEventListener('click', () => {
  if (currentPage > 1) {
      currentPage--;
      displayAnimals(currentPage);
  }
});

document.getElementById('nextPagination').addEventListener('click', () => {
  if (currentPage < Math.ceil(animals.length / itemsPerPage)) {
      currentPage++;
      displayAnimals(currentPage);
  }
});







async function dislpayBatteryStatus(){
  const batteryManager = await navigator.getBattery();
  console.log("is charging: ", batteryManager.charging);
  console.log("charging time (sec): ", batteryManager.chargingTime);
  console.log("discharging time (sec): ", batteryManager.dischargingTime);
  console.log("charge level: ", batteryManager.level);
}
dislpayBatteryStatus();