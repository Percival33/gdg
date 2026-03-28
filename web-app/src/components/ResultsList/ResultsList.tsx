import React from "react";
import type { Restaurant } from "../../types";
import RestaurantCard from "../RestaurantCard/RestaurantCard";
import "./ResultsList.css";

interface ResultsListProps {
  restaurants: Restaurant[];
  selectedIds: string[];
  onSelect: (id: string) => void;
}

const ResultsList: React.FC<ResultsListProps> = ({
  restaurants,
  selectedIds,
  onSelect,
}) => {
  if (restaurants.length === 0) {
    return (
      <div className="empty-results">
        No restaurants found for your craving. Try another dish!
      </div>
    );
  }

  return (
    <div className="results-list">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          isSelected={selectedIds.includes(restaurant.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default ResultsList;
