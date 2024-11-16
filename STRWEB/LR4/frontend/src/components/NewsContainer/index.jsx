import React from 'react';
import {NewsCard} from './NewsCard';
// import NewsF
import './NewsContainer.css'; // Optional: Import styles specific to NewsCardContainer

const NewsContainer = () => {
    return (
        <div id="news-card-container">
            {/* {newsList.map((newItem) => (
                <NewsCard key={newItem.id} news={{
                    imageUrl: newItem.image.url,
                    header: newItem.header,
                    shortDescription: newItem.short_description,
                    id: newItem.id,
                }} />
            ))} */}
            <NewsCard/>
            <NewsCard/>
            <NewsCard/>
            <NewsCard/>
            <NewsCard/>
            <NewsCard/>
            <NewsCard/>
            <NewsCard/>
        </div>
    );
};

export {NewsContainer};