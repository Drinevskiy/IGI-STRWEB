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
                <AnimalCard key={animal._id} animal={animal} />
            ))}
        </div>
    );
};

export {AnimalContainer};