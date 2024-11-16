import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import './AnimalDetail.css'; // Import the CSS file
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import getAgeString from '../../format functions/getAgeString';
import formatDate from '../../format functions/formatDate';


const AnimalFullCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const response = await axios.get(`animals/${id}`);
                console.log(response.data);
                setAnimal(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
                if (error.response && error.response.status === 500) {
                    navigate('../../not-found'); 
                }
            }
            finally{
                setLoading(false);
            }
        };

        fetchAnimal();
    }, []);
    if (loading) {
        return <div>Загрузка...</div>; // Индикатор загрузки
    }
    if (!animal) {
        navigate('*'); // Перенаправление на путь, если животное не найдено
        return null;
    }
    return (
        <div className="animal-detail-container">
            <img src='/icons/logo.png' alt={animal.name} className="animal-image" />
            {/* <img src={animal.imageUrl} alt={animal.name} className="animal-image" /> */}
            <div className="animal-info">
                <h1 className="animal-name">{animal.name}</h1>
                <p className="animal-description">{animal.description}</p>
                <div className="animal-additional-info">
                    <p><strong>Возраст:</strong> {getAgeString(animal.date_of_birth)}</p>
                    <p><strong>Вид:</strong> {animal.type}</p>
                    <p><strong>Семейство:</strong> {animal.family}</p>
                    <p><strong>Дата посутпления:</strong> {formatDate(animal.date_of_receipt)}</p>
                    <p><strong>Вольер:</strong> {animal.aviary.name}</p>
                </div>
            </div>
        </div>
    );
};

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

// const AnimalFullCard = () => {
//     return (
//         <div className="animal-detail-container">
//             <img src="https://avatars.mds.yandex.net/i?id=2a0000019329a61a640a7c75317b27521a5c-1395125-fast-images&n=13" alt="" className="animal-image" />
//             <div className="animal-info">
//                 <h1 className="animal-name">Крег</h1>
//                 <p className="animal-description">Аравана – крупная рыба с уплощенным с боков телом и заостренным хвостом. В длину рыба вырастает до 0,9 м., при этом ее вес может доходить до 6 кг. Тело араваны покрыто крупной светлой чешуей с сильным серебристым блеском.  У рыбы треугольная морда с большими глазами и широким ртом с двумя подвижными усиками. Усики необходимы для обнаружения добычи. С их помощью, аравана может засечь жертву даже в полной темноте.</p>
//                 <div className="animal-additional-info">
//                     <p><strong>Возраст:</strong> 3 года</p>
//                     <p><strong>Отряд:</strong> Лучеперые рыбы</p>
//                     <p><strong>Семейство:</strong> Аравановые</p>
//                     <p><strong>Дата поступления:</strong> 12.07.2022</p>
//                     <p><strong>Континент:</strong> Южная Америка</p>
//                     <p><strong>Вольер:</strong> Шинду</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

export {AnimalFullCard};