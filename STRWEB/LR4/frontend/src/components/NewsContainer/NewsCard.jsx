import React from 'react';
import PropTypes from 'prop-types';

// const NewsCard = ({ news }) => {
//     return (
//         <div className="new-card">
//             <img src={news.imageUrl} alt={news.header} />
//             <div className="new-info">
//                 <h2>{news.header}</h2>
//                 <p>{news.shortDescription}</p>
//                 <a className="custom-pointer" href={`/news/${news.id}`}>Читать далее</a>
//             </div>
//         </div>
//     );
// };

// NewsCard.propTypes = {
//     news: PropTypes.shape({
//         imageUrl: PropTypes.string.isRequired,
//         header: PropTypes.string.isRequired,
//         shortDescription: PropTypes.string.isRequired,
//         id: PropTypes.number.isRequired,
//     }).isRequired,
// };

const NewsCard = () => {
    return (
        <div className="new-card">
            <img src="https://img.belta.by/images/storage/news/with_archive/2024/000019_1731584461_675383_big.jpg?r=6706" alt="" />
            <div className="new-info">
                <h2>Очень очень длинный заголовк статьи для тестирования отображения информации на странице и еще больше текста необходимо для отображения</h2>
                {/* <a className="custom-pointer" href={`/news/${news.id}`}>Читать далее</a> */}
            </div>
        </div>
    );
};

export {NewsCard};