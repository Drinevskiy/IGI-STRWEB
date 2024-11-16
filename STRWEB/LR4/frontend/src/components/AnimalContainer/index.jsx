import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {AnimalCard} from './AnimalCard'; // Adjust the import path as necessary
import './AnimalContainer.css';
import axios from '../../utils/axios';

const AnimalContainer = () => {
    const [animals, setAnimals] = useState([]);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const response = await axios.get('/animals');
                setAnimals(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchAnimals();
    }, []);
    return (
        <div className="animal-cards-container">
            {animals.map((animal) => (
                <AnimalCard key={animal.pk} animal={animal} />
            ))}
        </div>
    );
};

AnimalContainer.propTypes = {
    animals: PropTypes.arrayOf(
        PropTypes.shape({
            pk: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            family: PropTypes.string.isRequired,
            age: PropTypes.number.isRequired,
            aviary: PropTypes.string.isRequired,
            image: PropTypes.shape({
                url: PropTypes.string,
            }),
        })
    ).isRequired,
};

// const AnimalContainer = () => {
//     let animals;
//     React.useEffect(() => {
//         axios.get('/animals')
//             .then(res => {animals = res.data;console.log(animals)})
//             .catch(err => console.error('Ошибка:', err));
//     }, [])
//     return (
//         <div className="animal-cards-container">
//             <AnimalCard />
//             <AnimalCard />
//             <AnimalCard />
//             <AnimalCard />
//             <AnimalCard />
//         </div>
//     );
// };

export {AnimalContainer};