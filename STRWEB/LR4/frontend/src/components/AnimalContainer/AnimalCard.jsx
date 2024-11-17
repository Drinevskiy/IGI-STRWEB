import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './AnimalCard.css'; // Ensure to create a CSS file for styling
import getAgeString from '../../format functions/getAgeString';

const AnimalCard = ({ animal }) => {
    return (
        <article>
            <Link to={`animals/${animal._id}`}>
                <div className="animal-card">
                    <img 
                        src='/icons/logo.png' 
                        // src={animal.image ? animal.image : '/icons/logo.png'} 
                        alt={animal.name || 'No Image'} 
                    />
                    <div className="animal-info">
                        <h2>{animal.name}</h2>
                        <hr />
                        <p>{animal.description}</p>
                        <ul className="animal-details">
                            <li><span>Вид:</span> {animal.type}</li>
                            <li><span>Семейство:</span> {animal.family}</li>
                            <li>
                                <span>Возраст:</span> {getAgeString(animal.date_of_birth)}
                            </li>
                            <li><span>Вольер:</span> {animal.aviary.name}</li>
                        </ul>
                    </div>
                </div>
            </Link>
        </article>
    );
};

AnimalCard.propTypes = {
    animal: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        family: PropTypes.string.isRequired,
        date_of_birth: PropTypes.string.isRequired,
        aviary: PropTypes.object.isRequired,
        image: PropTypes.string.isRequired,
    }).isRequired,
};
// const AnimalCard = () => {
//     return (
//         <article>
//             <Link to='/animals/1'>
//                 <div className="animal-card">
//                     <img 
//                         src="https://avatars.mds.yandex.net/i?id=e8334674cef413eb8f84931543cd7d003aeae182-4842027-images-thumbs&n=13" 
//                         alt='No Image' 
//                     />
//                     <div className="animal-info">
//                         <h2>Имя</h2>
//                         {/* <hr /> */}
//                         <p>Описание</p>
//                         <ul className="animal-details">
//                             <li><span>Вид:</span> кенгуровые</li>
//                             <li><span>Семейство:</span> сумчатые</li>
//                             <li>
//                                 <span>Возраст:</span> 2 года
//                             </li>
//                             <li><span>Вольер:</span> Шинду</li>
//                         </ul>
//                     </div>
//                 </div>
//             </Link>
//         </article>
//     );
// };

export { AnimalCard };