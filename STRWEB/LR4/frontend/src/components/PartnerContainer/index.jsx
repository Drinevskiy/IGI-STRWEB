import React from 'react';
import {PartnerCard} from './PartnerCard';
import './PartnerContainer.css';

// const PartnerContainer = ({ partners }) => {
//   return (
//     <section className="sponsor-section">
//       <h2 className="sponsor-title">Наши партнеры</h2>
//       <div className="sponsor-container">
//         {partners.map((partner, index) => (
//           <SponsorCard key={index} sponsor={partner} />
//         ))}
//       </div>
//     </section>
//   );
// };

const PartnerContainer = () => {
    return (
      <section className="sponsor-section">
        <h2 className="sponsor-title">Наши партнеры</h2>
        <div className="sponsor-container">
            <PartnerCard/>
            <PartnerCard/>
            <PartnerCard/>
            <PartnerCard/>
        </div>
      </section>
    );
  };

export {PartnerContainer};