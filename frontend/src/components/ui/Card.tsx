import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, style, className }) => {
  return (
    <div 
      className={className}
      style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '20px',
        ...style
      }}
    >
      {title && <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>{title}</h3>}
      {children}
    </div>
  );
};
