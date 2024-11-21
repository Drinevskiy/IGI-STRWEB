import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NewsCard = ({ newItem }) => {
    return (
        <div className="new-card">
            <Link to={`${newItem._id}`}>
                <img src={newItem.image} alt={newItem.header} />
                <div className="new-info">
                    <h2>{newItem.header}</h2>
                </div>
            </Link>
        </div>
    );
};

NewsCard.propTypes = {
    newItem: PropTypes.shape({
        image: PropTypes.string.isRequired,
        header: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
    }).isRequired,
};

// const NewsCard = () => {
//     return (
//         <div className="new-card">
//             <Link to="1">
//                 <img src="https://img.belta.by/images/storage/news/with_archive/2024/000019_1731584461_675383_big.jpg?r=6706" alt="" />
//                 <div className="new-info">
//                     <h2>Очень очень длинный заголовк статьи для тестирования отображения информации на странице и еще больше текста необходимо для отображения</h2>
//                     {/* <a className="custom-pointer" href={`/news/${news.id}`}>Читать далее</a> */}
//                 </div>
//             </Link>
//         </div>
//     );
// };

export {NewsCard};