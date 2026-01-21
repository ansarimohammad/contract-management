import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkStyle = (path: string) => ({
    textDecoration: 'none',
    color: isActive(path) ? '#3b82f6' : '#4b5563',
    fontWeight: isActive(path) ? 600 : 500,
    padding: '8px 12px',
    borderRadius: '6px',
    backgroundColor: isActive(path) ? '#eff6ff' : 'transparent',
    transition: 'all 0.2s',
  });

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 20px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#3b82f6',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            C
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>ContractManager</span>
        </Link>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/" style={linkStyle('/')}>Dashboard</Link>
          <Link to="/blueprints/new" style={linkStyle('/blueprints/new')}>Blueprint Builder</Link>
          <Link to="/contracts/new" style={linkStyle('/contracts/new')}>New Contract</Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          fontSize: '14px',
          fontWeight: 600
        }}>
          JD
        </div>
      </div>
    </nav>
  );
};
