import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label className="input-label">
          {label} {props.required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        className={`input-field ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <div className="input-error-msg">{error}</div>}
    </div>
  );
};
