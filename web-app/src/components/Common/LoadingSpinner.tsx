import React from 'react';
import './Common.css';

const LoadingSpinner: React.FC = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Finding your craving...</p>
  </div>
);

export default LoadingSpinner;
