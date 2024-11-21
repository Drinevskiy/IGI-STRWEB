import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import './Article.css'; // Import the CSS file
import axios from '../../utils/axios';
import formatDate from '../../format functions/formatDate';


const NewsFullCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newItem, setNewItem] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNew = async () => {
            try {
                const response = await axios.get(`news/${id}`);
                console.log(response.data);
                setNewItem(response.data);
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

        fetchNew();
    }, []);
    if (loading) {
        return <div>Загрузка...</div>; // Индикатор загрузки
    }
    if (!newItem) {
        navigate('*'); // Перенаправление на путь, если животное не найдено
        return null;
    }
    return (
        <div className="article-container">
            {/* <img src='/icons/instagram_logo.png' alt={newItem.title} className="article-image" /> */}
            <img src={newItem.image} alt={newItem.title} className="article-image" />
            <h1 className="article-title">{newItem.header}</h1>
            <p className="article-date">{formatDate(newItem.publication_date)}</p>
            <div className="article-text">{newItem.description}</div>
        </div>
    );
};

// NewsFullCard.propTypes = {
//     article: PropTypes.shape({
//         imageUrl: PropTypes.string.isRequired,
//         title: PropTypes.string.isRequired,
//         date: PropTypes.string.isRequired,
//         text: PropTypes.string.isRequired,
//     }).isRequired,
// };

// const NewsFullCard = () => {
    
//     return (
//         <div className="article-container">
//             <img src="https://img.belta.by/images/storage/news/with_archive/2024/000019_1731584461_675383_big.jpg?r=6706" alt="" className="article-image"/>
//             <h1 className="article-title">Очень очень длинный заголовк статьи для тестирования отображения информации на странице и еще больше текста необходимо для отображения</h1>
//             <p className="article-date">21.12.2023</p>
//             <div className="article-text">
//  13 ноября 2024 в 14:17
// Автор: Иван Кришкевич
// Постановление Совета министров №830 от 12 ноября 2024 года, опубликованное на Национальном правовом интернет-портале, вносит изменения в 437-е постановление Совмина от 1 июля 2019 года «Об утилизации транспортных средств». Нововведения касаются автомобилей, ввозимых в Беларусь из стран — членов ЕАЭС.


// Здесь важно напомнить, что ранее было принято постановление Совмина от 18.06.2024 №432, которое также вносило изменения в 437-е постановление. В частности, появился пункт 31, в котором было прописано, что критерием при определении ставки утильсбора в отношении транспортных средств, ввозимых (ввезенных) с территории государств — членов Евразийского экономического союза, с даты выпуска таможенным органом которых в иных государствах — членах ЕАЭС до момента представления в Республике Беларусь документа, отражающего исчисление и уплату утилизационного сбора, прошло менее одного года, является заключение о независимой оценке транспортного средства, выданное юридическим лицом, осуществляющим оценочную деятельность.

// В новом постановлении Совмина прописано, что положения пункта 31 не применяются в отношении ввозимых (ввезенных) с территории государств — членов ЕАЭС транспортных средств, если:

// такие транспортные средства были зарегистрированы не менее одного года в государстве — члене ЕАЭС в любой период до дня представления документа, отражающего исчисление и уплату утилизационного сбора;
// продавец (поставщик) или покупатель таких транспортных средств, указанный во внешнеторговом договоре, является представителем изготовителя транспортных средств на территории Республики Беларусь, указанным в одобрении типа транспортного средства, и при этом плательщик утилизационного сбора является покупателем, указанным в таком внешнеторговом договоре.
// Настоящее постановление вступает в силу через 10 дней после его официального опубликования и распространяет свое действие на отношения, возникшие с 1 июля 2024 года.</div>
//         </div>
//     );
// };

export {NewsFullCard};