import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties; // Keep style for specific overrides if needed
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, style, className = '' }) => {
  return (
    <div 
      className={`card ${className}`}
      style={style}
    >
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </div>
  );
};
