import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <div style={{ marginBottom: '10px', width: '100%' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '14px', color: '#111827' }}>
          {label} {props.required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '8px 12px',
          border: error ? '1px solid #ef4444' : '1px solid #e5e7eb',
          borderRadius: '4px',
          fontSize: '14px',
          ...style,
        }}
        {...props}
      />
      {error && <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};
