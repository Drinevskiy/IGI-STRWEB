import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './AnimalCard.css'; // Ensure to create a CSS file for styling
import getAgeString from '../../format functions/getAgeString';
import axios from '../../utils/axios';

const AnimalCard = ({ animal }) => {
    const [image, setImage] = useState(null);
    useEffect(() => {
        const image = animal.image ? animal.image : 'uploads/lapka.jpg';
        axios.get(image, { responseType: 'blob' })
        .then(response => {
            const imageUrl = URL.createObjectURL(response.data);
            setImage(imageUrl);
        })
            .catch(error =>
            console.error('Ошибка при получении животного:', error)
        );
      }, []);
    return (
        <article>
            <Link to={`animals/${animal._id}`}>
                <div className="animal-card">
                    {image && <img src={image} alt={animal.name} />}
                    <div className="animal-info">
                        <h2>{animal.name}</h2>
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

export { AnimalCard };