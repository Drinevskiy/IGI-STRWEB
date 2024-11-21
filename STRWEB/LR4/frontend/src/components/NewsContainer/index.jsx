import React from 'react';
import {NewsCard} from './NewsCard';
import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import './NewsContainer.css'; 

const NewsContainer = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('/news');
                setNews(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };
        fetchNews();
    }, []);

    return (
        <div id="news-card-container">
            {news.map((newItem) => (
                <NewsCard key={newItem._id} newItem={newItem} />
            ))}
        </div>
    );
};

export {NewsContainer};