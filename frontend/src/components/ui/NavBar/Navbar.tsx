import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

export const NavBar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand-link">
          <div className="brand-icon">C</div>
          <span className="brand-text">ContractFlow</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/blueprints/new" className={`nav-link ${isActive('/blueprints/new') ? 'active' : ''}`}>Builder</Link>
          <Link to="/contracts/new" className={`nav-link ${isActive('/contracts/new') ? 'active' : ''}`}>New Contract</Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMenu}
          style={{ display: 'none' }} 
        >
          ☰
        </button>
        <div className="user-avatar">JD</div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu" style={{
          position: 'absolute',
          top: '64px',
          left: 0,
          right: 0,
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 49
        }}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
          <Link to="/blueprints/new" className={`nav-link ${isActive('/blueprints/new') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Builder</Link>
          <Link to="/contracts/new" className={`nav-link ${isActive('/contracts/new') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>New Contract</Link>
        </div>
      )}
    </nav>
  );
};
