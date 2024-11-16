import React from 'react';
import PropTypes from 'prop-types';
import './AnimalDetail.css'; // Import the CSS file

// const AnimalFullCard = ({ animal }) => {
//     return (
//         <div className="animal-detail-container">
//             <img src={animal.imageUrl} alt={animal.name} className="animal-image" />
//             <div className="animal-info">
//                 <h1 className="animal-name">{animal.name}</h1>
//                 <p className="animal-description">{animal.description}</p>
//                 <div className="animal-additional-info">
//                     <p><strong>Age:</strong> {animal.age} years</p>
//                     <p><strong>Species:</strong> {animal.species}</p>
//                     <p><strong>Family:</strong> {animal.family}</p>
//                     <p><strong>Date of Admission:</strong> {animal.admissionDate}</p>
//                     <p><strong>Continent:</strong> {animal.continent}</p>
//                     <p><strong>Enclosure:</strong> {animal.enclosure}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// AnimalFullCard.propTypes = {
//     animal: PropTypes.shape({
//         imageUrl: PropTypes.string.isRequired,
//         name: PropTypes.string.isRequired,
//         description: PropTypes.string.isRequired,
//         age: PropTypes.number.isRequired,
//         species: PropTypes.string.isRequired,
//         family: PropTypes.string.isRequired,
//         admissionDate: PropTypes.string.isRequired,
//         continent: PropTypes.string.isRequired,
//         enclosure: PropTypes.string.isRequired,
//     }).isRequired,
// };

const AnimalFullCard = () => {
    return (
        <div className="animal-detail-container">
            <img src="https://avatars.mds.yandex.net/i?id=2a0000019329a61a640a7c75317b27521a5c-1395125-fast-images&n=13" alt="" className="animal-image" />
            <div className="animal-info">
                <h1 className="animal-name">Крег</h1>
                <p className="animal-description">Аравана – крупная рыба с уплощенным с боков телом и заостренным хвостом. В длину рыба вырастает до 0,9 м., при этом ее вес может доходить до 6 кг. Тело араваны покрыто крупной светлой чешуей с сильным серебристым блеском.  У рыбы треугольная морда с большими глазами и широким ртом с двумя подвижными усиками. Усики необходимы для обнаружения добычи. С их помощью, аравана может засечь жертву даже в полной темноте.</p>
                <div className="animal-additional-info">
                    <p><strong>Возраст:</strong> 3 года</p>
                    <p><strong>Отряд:</strong> Лучеперые рыбы</p>
                    <p><strong>Семейство:</strong> Аравановые</p>
                    <p><strong>Дата поступления:</strong> 12.07.2022</p>
                    <p><strong>Континент:</strong> Южная Америка</p>
                    <p><strong>Вольер:</strong> Шинду</p>
                </div>
            </div>
        </div>
    );
};

export {AnimalFullCard};