import React from 'react';
import { Restaurant } from '../../types';
import './RestaurantCard.css';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  isSelected,
  onSelect,
}) => {
  return (
    <div className={`restaurant-card ${restaurant.isBestMatch ? 'best-match' : ''}`}>
      {restaurant.isBestMatch && <div className="badge">Best Match</div>}
      <div className="card-header">
        <h3 className="restaurant-name">{restaurant.name}</h3>
        <span className="rating">⭐ {restaurant.rating}</span>
      </div>
      <div className="card-body">
        <p className="distance">{restaurant.distance} away</p>
        <p className="price">{''.padStart(restaurant.priceLevel, '$')}</p>
      </div>
      <div className="card-actions">
        <button
          className={`compare-button ${isSelected ? 'selected' : ''}`}
          onClick={() => onSelect?.(restaurant.id)}
        >
          {isSelected ? 'Selected' : 'Select to Compare'}
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;
