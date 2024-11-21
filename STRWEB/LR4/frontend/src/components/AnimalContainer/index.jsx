import React, {useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {AnimalCard} from './AnimalCard'; 
import './AnimalContainer.css';
import {useAuth} from '../../utils/AuthContext';

const AnimalContainer = ({animals}) => {
    const location = useLocation();
    const { token, saveToken } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        if (accessToken) {
            saveToken(accessToken);
        }
    }, [location]);

    return (
        <>
            <div className="animal-cards-container">
                {animals.map((animal) => (
                    <AnimalCard key={animal._id} animal={animal} />
                ))}
            </div>
        </>
    );
};

export {AnimalContainer};