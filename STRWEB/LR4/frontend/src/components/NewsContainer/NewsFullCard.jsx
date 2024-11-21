import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Article.css';
import axios from '../../utils/axios';
import formatDate from '../../format functions/formatDate';

const no_photo = '/no_photo.jpg';

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
        return <div>Загрузка...</div>; 
    }
    if (!newItem) {
        navigate('*'); 
        return null;
    }
    return (
        <div className="article-container">
            <img src={newItem.image || no_photo} alt={newItem.title} className="article-image" />
            <h1 className="article-title">{newItem.header}</h1>
            <p className="article-date">{formatDate(newItem.publication_date)}</p>
            <div className="article-text">{newItem.description}</div>
        </div>
    );
};

export {NewsFullCard};