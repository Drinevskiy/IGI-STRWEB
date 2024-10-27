let lastScrollY = window.scrollY;

const fox = document.getElementById('fox');
const palmRight = document.getElementById('palm_right');
const palmLeft = document.getElementById('palm_left');
// fox.style.setProperty('transform', 'translate(370px, -80px)');
fox.style.setProperty('top', '260px');
fox.style.setProperty('right', '400px');
palmRight.style.right = '0px';
palmLeft.style.left = '0px';
let foxTranslateX = 370;
let foxTranslateY = -80;
const bear = document.getElementById('bear');
const rabbit = document.getElementById('rabbit');
    window.addEventListener('scroll', () => {
        let currentScrollY = scrollY;
        console.log('cur' + currentScrollY);
        // console.log('last' + lastScrollY);
        // console.log('foxTop' + foxTop);
        console.log(`translate(${foxTranslateX + currentScrollY/10}px, ${foxTranslateY + currentScrollY/1.8}px)`);
        const isScrollingDown = currentScrollY > lastScrollY;
        // if(currentScrollY <= 270){
        foxTranslateY = currentScrollY
        // if(isScrollingDown){

        //     foxTranslateY += currentScrollY/12;
        //     foxTranslateX += currentScrollY/120;
        // }
        // else{
        //     foxTranslateY -= currentScrollY/12;
        //     foxTranslateX -= currentScrollY/120;
        // }
        fox.style.top = `${260 + currentScrollY/1.8}px`
        fox.style.right = `${400 - currentScrollY/10}px`
        // fox.style.transform = `translate(${foxTranslateX}px, ${foxTranslateY}px)`;
        // }
        // else{
            // fox.style.transform = isScrollingDown ? `translate(${foxTranslateX - currentScrollY/10}px, ${foxTranslateY + currentScrollY/1.8}px)` : `translate(${foxTranslateX - currentScrollY/10}px, ${foxTranslateY - currentScrollY/1.8}px)`;
        // }
        // if(lastScrollY <= value){
        //     foxTop += value/2;
        // }
        // else{
        //     foxTop -= value/2;
        // }

        
        // fox.style.top = `${foxTop}px`
        // if(value < 400){
        //     foxRight -= value/100;
        //     fox.style.right = `${foxRight}px`
        // }
        // else{
        //     foxRight += value/100;
        //     fox.style.right = `${foxRight}px`
        // }
        // cloud2.style.left = `-${value*2}px`
        palmRight.style.right = `-${currentScrollY/3}px`;
        palmLeft.style.left = `-${currentScrollY/3}px`;
        // palmRight.style.transform = `rotateX(${currentScrollY/30}deg)`;
        // cloud1.style.left = `${value*2}px`
        // text.style.bottom = `-${value}px`;
        // man.style.height = `${window.innerHeight - value}px`
        lastScrollY = currentScrollY;
    });