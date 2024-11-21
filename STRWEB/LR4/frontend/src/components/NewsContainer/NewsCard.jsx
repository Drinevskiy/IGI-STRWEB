import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const no_photo = '/no_photo.jpg';

const NewsCard = ({ newItem }) => {
    return (
        <div className="new-card">
            <Link to={`${newItem._id}`}>
                <img src={newItem.image || no_photo} alt={newItem.header} />
                <div className="new-info">
                    <h2>{newItem.header}</h2>
                </div>
            </Link>
        </div>
    );
};

NewsCard.propTypes = {
    newItem: PropTypes.shape({
        image: PropTypes.string.isRequired,
        header: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
    }).isRequired,
};

export {NewsCard};