import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import './AnimalDetail.css'; // Import the CSS file
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import getAgeString from '../../format functions/getAgeString';
import formatDate from '../../format functions/formatDate';
import getDateInfo from '../../format functions/getDateInfo';

const AnimalFullCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState({});
    const [loading, setLoading] = useState(true);
    const [addDateUserTimeZone, setAddDateUserTimeZone] = useState('');
    const [addDateUserUTC, setAddDateUserUTC] = useState('');
    const [modifyDateUserTimeZone, setModifyDateUserTimeZone] = useState('');
    const [modifyDateUserUTC, setModifyDateUserUTC] = useState('');
    const [userTimeZone, setUserTimeZone] = useState('');


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

    useEffect(() => {
        if (animal) {
            const addTime = getDateInfo(animal.createdAt);
            const modifyTime = getDateInfo(animal.updatedAt);
            setUserTimeZone(addTime.timeZone);
            setAddDateUserTimeZone(addTime.userTime);
            setAddDateUserUTC(addTime.utcTime);
            setModifyDateUserTimeZone(modifyTime.userTime);
            setModifyDateUserUTC(modifyTime.utcTime);
        }
    }, [animal]);

    if (loading) {
        return <div>Загрузка...</div>; // Индикатор загрузки
    }
    if (!animal) {
        navigate('*'); // Перенаправление на путь, если животное не найдено
        return null;
    }
    return (
        <>
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
        <div className="animal-created-updated-info">
            <div>Дата добавления. {userTimeZone}: {addDateUserTimeZone}, UTC: {addDateUserUTC}</div>
            <div>Дата изменения. {userTimeZone}: {modifyDateUserTimeZone}, UTC: {modifyDateUserUTC}</div>
        </div>
        </>
    );
};

export {AnimalFullCard};