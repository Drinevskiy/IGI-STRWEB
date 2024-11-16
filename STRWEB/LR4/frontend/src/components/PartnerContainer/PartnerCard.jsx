import React from 'react';
import './PartnerCard.css';

const PartnerCard = ({ partner }) => {
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
          // src={partner.image}
          src='logo512.png'
          alt={partner.name}
        />
        <p className="sponsor-name">{partner.name}</p>
      </div>
    </a>
  );
};

// const PartnerCard = () => {
//     return (
//       <a
//         className="sponsor-link"
//         href="{sponsor.url}"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <div className="sponsor-card">
//           <img
//             className="sponsor-image"
//             src="https://i.pinimg.com/736x/56/cb/fd/56cbfd28d5fd92e026c88ad9e287fc0b.jpg"
//             alt=""
//           />
//           <p className="sponsor-name">Coca Cola</p>
//         </div>
//       </a>
//     );
//   };

export {PartnerCard};