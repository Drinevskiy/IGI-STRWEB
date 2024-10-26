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