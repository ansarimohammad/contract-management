import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

export const NavBar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

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
        <div className="user-avatar">JD</div>
      </div>
    </nav>
  );
};
