import React from 'react';
import './PartnerCard.css';

const no_photo = '/no_photo.jpg';

const PartnerCard = ({ partner }) => {
  console.log(partner);
  return (
    <a
      className="sponsor-link"
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="sponsor-card">
        <img
          className="sponsor-image"
          src={partner.imageUrl || no_photo}
          alt={partner.name}
        />
        <p className="sponsor-name">{partner.name}</p>
      </div>
    </a>
  );
};

export {PartnerCard};