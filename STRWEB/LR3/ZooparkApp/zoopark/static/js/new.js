container = document.querySelector('#generate-input');
container.innerHtml = "";

editCheckbox = document.querySelector('#edit');
editCheckbox.addEventListener('change', (e) => {
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
    if(e.target.checked){
        let card = document.getElementsByClassName("new-card")[0];
        const formElement = document.createElement('div');
        const fontSizeInput = document.createElement('input');
        fontSizeInput.id = "font-input";
        fontSizeInput.name = "font-input";
        fontSizeInput.type = "number";
        fontSizeInput.min = "10";
        fontSizeInput.max = "30";
        const fontSizeLabel = document.createElement('label');
        fontSizeLabel.setAttribute('for', "font-input");
        fontSizeLabel.textContent = "Шрифт";
        formElement.appendChild(fontSizeLabel);
        formElement.appendChild(fontSizeInput);
        container.appendChild(formElement);
        fontSizeInput.addEventListener('input', (e) => {
            let size = e.target.value > 30 ? 30 : e.target.value < 10 ? 10 : e.target.value;
            card.style.fontSize = size + 'px';
        });

        const formElement1 = document.createElement('div');
        const fontColorInput = document.createElement('input');
        fontColorInput.id = "font-color-input";
        fontColorInput.name = "font-color-input";
        fontColorInput.type = "color";
        const fontColorLabel = document.createElement('label');
        fontColorLabel.setAttribute('for', "font-color-input");
        fontColorLabel.textContent = "Цвет шрифта";
        formElement1.appendChild(fontColorLabel);
        formElement1.appendChild(fontColorInput);
        container.appendChild(formElement1);
        fontColorInput.addEventListener('input', (e) => {
            card.style.color = e.target.value;
        });

        const formElement2 = document.createElement('div');
        const backgroundColorInput = document.createElement('input');
        backgroundColorInput.id = "font-color-input";
        backgroundColorInput.name = "font-color-input";
        backgroundColorInput.type = "color";
        const backgroundColorLabel = document.createElement('label');
        backgroundColorLabel.setAttribute('for', "font-color-input");
        backgroundColorLabel.textContent = "Цвет шрифта";
        formElement2.appendChild(backgroundColorLabel);
        formElement2.appendChild(backgroundColorInput);
        container.appendChild(formElement2);
        backgroundColorInput.addEventListener('input', (e) => {
            console.log(e.target.value);
            card.style.backgroundColor = e.target.value;
        });
    }
});

