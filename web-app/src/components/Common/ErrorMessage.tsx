import React from 'react';
import './Common.css';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="error-container">
    <p>{message}</p>
  </div>
);

export default ErrorMessage;
