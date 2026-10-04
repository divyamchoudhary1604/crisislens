import { Link, useLocation } from 'react-router-dom';

export default function Header({ isDemo }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`app-header ${isDemo ? '' : 'no-demo'}`}>
      <div className="header-brand">
        <Link to="/" className="header-logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">🔍</div>
          CrisisLens
        </Link>
        <span className="header-tagline">
          Emergency information, organized around you
        </span>
      </div>

      <nav className="header-nav" aria-label="Main navigation">
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          📊 Dashboard
        </Link>
        <Link 
          to="/map" 
          className={`nav-link ${isActive('/map') ? 'active' : ''}`}
        >
          🗺️ Map
        </Link>
        <Link 
          to="/ask" 
          className={`nav-link ${isActive('/ask') ? 'active' : ''}`}
        >
          💬 Ask
        </Link>
        <Link 
          to="/profile" 
          className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
        >
          👤 Profile
        </Link>
        <Link 
          to="/about" 
          className={`nav-link ${isActive('/about') ? 'active' : ''}`}
        >
          ℹ️ About
        </Link>
      </nav>
    </header>
  );
}
