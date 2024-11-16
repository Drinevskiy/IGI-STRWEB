import React from 'react';
import PropTypes from 'prop-types';
import {AnimalCard} from './AnimalCard'; // Adjust the import path as necessary
import './AnimalContainer.css';

// const AnimalContainer = ({ animals }) => {
//     return (
//         <div className="animal-cards-container">
//             {animals.map((animal) => (
//                 <AnimalCard key={animal.pk} animal={animal} />
//             ))}
//         </div>
//     );
// };

// AnimalContainer.propTypes = {
//     animals: PropTypes.arrayOf(
//         PropTypes.shape({
//             pk: PropTypes.number.isRequired,
//             name: PropTypes.string.isRequired,
//             description: PropTypes.string.isRequired,
//             type: PropTypes.string.isRequired,
//             family: PropTypes.string.isRequired,
//             age: PropTypes.number.isRequired,
//             aviary: PropTypes.string.isRequired,
//             image: PropTypes.shape({
//                 url: PropTypes.string,
//             }),
//         })
//     ).isRequired,
// };

const AnimalContainer = () => {
    return (
        <div className="animal-cards-container">
            <AnimalCard />
            <AnimalCard />
            <AnimalCard />
            <AnimalCard />
            <AnimalCard />
        </div>
    );
};

export {AnimalContainer};