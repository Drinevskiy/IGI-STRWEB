

// ymaps.ready(init);
// function init(){
//     let latitude;
//     let longitude;
//     function successHandler(position) {
//         // latitude = position.coords.latitude;
//         // longitude = position.coords.longitude;
//         // console.log("Широта: ", position.coords.latitude);
//         // console.log("Долгота: ", position.coords.longitude);
//         // console.log("Скорость перемещения: ", position.coords.speed);
//         // console.log("Точность: ", position.coords.accuracy);
//         // console.log("Направление: ", position.coords.heading);
//         var location = ymaps.geolocation.get();

// // var myGeoObject = new ymaps.GeoObject({
// //     geometry: {
// //         type: "Point", // тип геометрии - точка
// //         coordinates: [latitude, longitude] // координаты точки
// //     }
// // });
// // Асинхронная обработка ответа.
// location.then(
//   function(result) {
//     var myMap = new ymaps.Map("map", {
//         center: [result.geoObjects, longitude],
//         zoom: 16
//     });
//     myMap.geoObjects.add(result.geoObjects)
//   },
//   function(err) {
//     console.log('Ошибка: ' + err)
//   }
// );


// // Размещение геообъекта на карте.
// myMap.geoObjects.add(myGeoObject);
        
//       };
//       function errorHandler(error) {  
//         console.log(error.message);    // выводим сообщение об ошибке
//         console.log(error.code);    // выводим код ошибки
//       }
//       navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    
// }

// var location = ymaps.geolocation;
// var myMap = new ymaps.Map('map', {
//     center: [55.76, 37.64],
//     zoom: 10
// }, {
//     searchControlProvider: 'yandex#search'
// });

// // Получение местоположения и автоматическое отображение его на карте.
// location.get({
//         mapStateAutoApply: true
//     })
// .then(
//     function(result) {
//         // Получение местоположения пользователя.
//         var userAddress = result.geoObjects.get(0).properties.get('text');
//         var userCoodinates = result.geoObjects.get(0).geometry.getCoordinates();
//         // Пропишем полученный адрес в балуне.
//         result.geoObjects.get(0).properties.set({
//             balloonContentBody: 'Адрес: ' + userAddress +
//                                 '<br/>Координаты:' + userCoodinates
//     });
//         myMap.geoObjects.add(result.geoObjects)
//     },
//     function(err) {
//         console.log('Ошибка: ' + err)
//     }
// );
ymaps.ready(init);

function init() {
    var myMap;
    var userCoordinates;
    var zooCoordinates;
        // myMap = new ymaps.Map('map', {
        //     center: [55.23, 34.65],
        //     zoom: 17
        // }, {
        //     searchControlProvider: 'yandex#search'
        // });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert("Geolocation не поддерживается вашим браузером.");
        }
        function showPosition(position) {
            userCoordinates = [position.coords.latitude, position.coords.longitude];

            // Создаем карту с центром на местоположении пользователя
            myMap = new ymaps.Map("map", {
                center: userCoordinates,
                zoom: 15
            }, {
                searchControlProvider: 'yandex#search'
            });

            // Создаем маркер в местоположении пользователя
            var placemark = new ymaps.Placemark(userCoordinates, {
                iconContent: "Вы здесь!"
            },{
                preset: 'islands#blackStretchyIcon',
                iconColor: '#3caa3c'
            });

            // Добавляем маркер на карту
            myMap.geoObjects.add(placemark);
        }

        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    alert("Пользователь отклонил запрос на получение местоположения.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Информация о местоположении недоступна.");
                    break;
                case error.TIMEOUT:
                    alert("Время ожидания запроса истекло.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("Произошла неизвестная ошибка.");
                    break;
            }
        }
        ymaps.geocode("Минск, просп. Дзержинского, 104Б", {
            results: 1
        }).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0),
            // Координаты геообъекта.
            zooCoordinates = firstGeoObject.geometry.getCoordinates();
            // console.log(coords);
            // Область видимости геообъекта.
            bounds = firstGeoObject.properties.get('boundedBy');

            firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
            // Получаем строку с адресом и выводим в иконке геообъекта.
            firstGeoObject.properties.set('iconCaption', "Aniland");

            // Добавляем первый найденный геообъект на карту.
            myMap.geoObjects.add(firstGeoObject);
            // Масштабируем карту на область видимости геообъекта.
            // myMap.setBounds(bounds, {
            //     // Проверяем наличие тайлов на данном масштабе.
            //     checkZoomRange: true
            // });
            var multiRoute = new ymaps.multiRouter.MultiRoute({
                // Описание опорных точек мультимаршрута.
                referencePoints: [
                    userCoordinates,
                    zooCoordinates
                ],
                // Параметры маршрутизации.
                params: {
                    // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
                    results: 3
                }
            }, {
                // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
                boundsAutoApply: true
            });
            myMap.geoObjects.add(multiRoute);
        });
        
    // Сравним положение, вычисленное по ip пользователя и
    // положение, вычисленное средствами браузера.
    // geolocation.get({
    //     provider: 'yandex',
    //     mapStateAutoApply: false
    // }).then(function (result) {
    //     // Красным цветом пометим положение, вычисленное через ip.
    //     result.geoObjects.options.set('preset', 'islands#redCircleIcon');
    //     result.geoObjects.get(0).properties.set({
    //         balloonContentBody: 'Мое местоположение'
    //     });
    //     myMap.geoObjects.add(result.geoObjects);
    // });

    // geolocation.get({
    //     provider: 'browser',
    //     mapStateAutoApply: false
    // }).then(function (result) {
    //     // Синим цветом пометим положение, полученное через браузер.
    //     // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
    //     result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
    //     myMap.setCenter( result.geoObjects.get(0).geometry.getCoordinates() );
        
    //     myMap.geoObjects.add(result.geoObjects);
    // });
}