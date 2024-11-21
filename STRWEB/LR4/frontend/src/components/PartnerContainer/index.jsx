import React, {useEffect, useState} from 'react';
import {PartnerCard} from './PartnerCard';
import './PartnerContainer.css';
import axios from '../../utils/axios';

const PartnerContainer = () => {
  const [partners, setPartners] = useState([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await axios.get('/partners');
                setPartners(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchPartners();
    }, []);
  return (
    <section className="sponsor-section">
      <h2 className="sponsor-title">Наши партнеры</h2>
      <div className="sponsor-container">
        {partners.map((partner) => (
          <PartnerCard key={partner._id} partner={partner} />
        ))}
      </div>
    </section>
  );
};

export {PartnerContainer};