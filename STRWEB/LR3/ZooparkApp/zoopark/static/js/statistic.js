Chart.defaults.font.size = 20;
Chart.defaults.color = '#000';
let families;
let aviaries;
let chartBar;
let chartPolar;
let chartLine;
fetch('../api/statistic/family-count')
    .then(response => response.json())
    .then(my_families => {
      families = my_families;
      console.log(families); // Теперь у вас есть массив животных
      displayPlot();
    })
    .catch(error => console.error('Ошибка:', error));

fetch('../api/statistic/aviary-count')
    .then(response => response.json())
    .then(my_aviaries => {
      aviaries = my_aviaries;
      console.log(aviaries); // Теперь у вас есть массив животных
      displayPolarPlot();
    })
    .catch(error => console.error('Ошибка:', error));

function generateColors(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        // Генерируем случайный цвет в формате rgba
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        colors.push(`rgba(${r}, ${g}, ${b})`);
    }
    return colors;
}

const ctx = document.getElementById('myChartBar');
const ctxPolarArea = document.getElementById('myChartPolarArea');
const ctxLine = document.getElementById('myChartLine');

function displayPlot(){
    let delayed;
    if (chartBar) {
        chartBar.destroy();
    }
    const colors = generateColors(Object.keys(families).length);
    chartBar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(families),
            datasets: [{
                // label: null,
                data: Object.values(families),
                backgroundColor: colors, // Используем сгенерированные цвета
                borderColor: colors, // Полная непрозрачность для границ
                // borderColor: colors.map(color => color.replace('0.5', '1')), // Полная непрозрачность для границ
                // borderWidth: 3,
                borderRadius: 15
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                    // position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Численность семейств'
                }
            },
            animation: {
                onComplete: () => {
                  delayed = true;
                },
                delay: (context) => {
                  let delay = 0;
                  if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                  }
                  return delay;
                },
              },
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    }
    );

}



function displayPolarPlot() {
    if (chartPolar) {
        chartPolar.destroy();
    }

    const colors = generateColors(Object.keys(aviaries).length);
    
    chartPolar = new Chart(ctxPolarArea, {
        type: 'polarArea',
        data: {
            labels: Object.keys(aviaries),
            datasets: [{
                data: Object.values(aviaries),
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Численность вольеров'
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                }
            },
            elements: {
                arc: {
                  backgroundColor: function(context) {
                    let c = colors[context.dataIndex];
                    if (!c) {
                      return;
                    }
                    if (context.active) {
                      c = Chart.helpers.getHoverColor(c);
                    }
                    const mid = Chart.helpers.color(c).desaturate(0.4).darken(0.2).rgbString();
                    const start = Chart.helpers.color(c).lighten(0.2).rotate(270).rgbString();
                    const end = Chart.helpers.color(c).lighten(0.1).rgbString();
                    return createRadialGradient3(context, start, mid, end);
                  },
                }
              }
        }
    });
}

const cache = new Map();
let width = null;
let height = null;

function createRadialGradient3(context, c1, c2, c3) {
    const chartArea = context.chart.chartArea;
    if (!chartArea) {
      // This case happens on initial chart load
      return;
    }
  
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (width !== chartWidth || height !== chartHeight) {
      cache.clear();
    }
    let gradient = cache.get(c1 + c2 + c3);
    if (!gradient) {
      // Create the gradient because this is either the first render
      // or the size of the chart has changed
      width = chartWidth;
      height = chartHeight;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const r = Math.min(
        (chartArea.right - chartArea.left) / 2,
        (chartArea.bottom - chartArea.top) / 2
      );
      const ctx = context.chart.ctx;
      gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
      gradient.addColorStop(0, c1);
      gradient.addColorStop(0.5, c2);
      gradient.addColorStop(1, c3);
      cache.set(c1 + c2 + c3, gradient);
    }
  
    return gradient;
  }

ctx.addEventListener('click', () => displayPlot());
ctxPolarArea.addEventListener('click', () => displayPolarPlot());
ctxLine.addEventListener('click', () => displayLinePlot());

document.getElementById('saveBtn').addEventListener('click', () => {
    const link1 = document.createElement('a');
    link1.href = ctx.toDataURL('image/png'); // Получаем данные изображения
    link1.download = 'chart.png'; // Имя файла
    link1.click(); // Имитируем клик по ссылке для скачивания
    const link2 = document.createElement('a');
    link2.href = ctxPolarArea.toDataURL('image/png'); // Получаем данные изображения
    link2.download = 'chartPolar.png'; // Имя файла
    link2.click();
    const link3 = document.createElement('a');
    link3.href = ctxLine.toDataURL('image/png'); // Получаем данные изображения
    link3.download = 'chartLine.png'; // Имя файла
    link3.click();
});


const xValues = [];
const fxValues = [];
const mathFxValues = [];

function factorial(n) {
    if (n < 0) return undefined; // Факториал не определен для отрицательных чисел
    return n === 0 ? 1 : n * factorial(n - 1);
}
function calculateSeriesValue(x, epsilon = 1e-6) {
    let value = 0;
    let term;
    let i = 0;

    do {
        // Формула для члена ряда разложения арксинуса
        const numerator = factorial(2 * i);
        const denominator = Math.pow(4, i) * Math.pow(factorial(i), 2) * (2 * i + 1);
        term = (numerator / denominator) * Math.pow(x, 2 * i + 1);
        value += term;
        i++;
    } while (Math.abs(term) >= epsilon);

    return value;
}
// Функция для вычисления значения функции по разложению в ряд с заданной точностью
// function calculateSeriesValue(x, n, epsilon = 1e-6) {
//     let value = 0;
//     let term = 0;
//     let i = 0;

//     do {
//         term = (Math.pow(-1, i) * Math.pow(x, 2 * i + 1)) / (factorial(2 * i + 1) * (2 * i + 1));
//         value += term;
//         i++;
//     } while (Math.abs(term) >= epsilon && i <= n);

//     return value;
// }

// График разложения функции в ряд

const totalDuration = 800;
let delayBetweenPoints;
const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
const animation = {
  x: {
    type: 'number',
    easing: 'linear',
    duration: delayBetweenPoints,
    from: NaN, // the point is initially skipped
    delay(ctx) {
      if (ctx.type !== 'data' || ctx.xStarted) {
        return 0;
      }
      ctx.xStarted = true;
      return ctx.index * delayBetweenPoints;
    }
  },
  y: {
    type: 'number',
    easing: 'linear',
    duration: delayBetweenPoints,
    from: previousY,
    delay(ctx) {
      if (ctx.type !== 'data' || ctx.yStarted) {
        return 0;
      }
      ctx.yStarted = true;
      return ctx.index * delayBetweenPoints;
    }
  }
};

function displayLinePlot(){
    if (chartLine) {
        chartLine.destroy();
    }
    console.log(xValues);
    chartLine = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'Ряд',
                data: fxValues,
                borderColor: 'blue',
                borderWidth: 1,
                radius: 0,
                
                
                // fill: false
            },
            {
                label: 'arcsin',
                data: mathFxValues,
                borderColor: 'red',
                borderWidth: 1,
                radius: 0,
                // fill: false
            }]
        },
        options: {
            animation,
            interaction: {
            intersect: false
            },
            plugins: {
            legend: true,
            title: {
                display: true,
                text: 'Разложение функции в ряд'
            }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'x'
                    },
                    type: 'linear'
                },
                y: {
                    title: {
                        display: true,
                        text: 'F(x)'
                    },
                    type: 'linear'
                }
            }
        }
    });
}
;
document.addEventListener('DOMContentLoaded', () => {
    for (let x = -1; x <= 1; x += 0.05) {
        xValues.push(x);
        fxValues.push(calculateSeriesValue(x));
        mathFxValues.push(Math.asin(x));
        
    }
    
    xValues.push(1);
    mathFxValues.push(Math.asin(1));
    delayBetweenPoints = totalDuration / xValues.length;
    displayLinePlot();
});



