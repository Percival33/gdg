import React from 'react';
import { Restaurant } from '../../types';
import './ComparisonModal.css';

interface ComparisonModalProps {
  restaurants: Restaurant[];
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  restaurants,
  onClose,
}) => {
  if (restaurants.length === 0) return null;

  return (
    <div className="modal-overlay">
      <div className="comparison-modal">
        <div className="modal-header">
          <h2>Compare Restaurants</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-content">
          <div className="comparison-grid">
            {restaurants.map((r) => (
              <div key={r.id} className="comparison-column">
                <div className="comp-item name">{r.name}</div>
                <div className="comp-item rating">⭐ {r.rating}</div>
                <div className="comp-item distance">{r.distance}</div>
                <div className="comp-item price">{''.padStart(r.priceLevel, '$')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
