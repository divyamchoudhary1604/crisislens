import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col">
            <div className="footer-brand">
              <div className="footer-logo-icon">🔍</div>
              <span className="footer-logo-text">CrisisLens</span>
            </div>
            <p className="footer-description">
              An open-source AI crisis information assistant — built for one person, 
              designed with transparency at its core.
            </p>
            <div className="footer-status">
              <span className="status-dot status-dot-live"></span>
              <span>Open-Source AI Powered</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigate</h4>
            <div className="footer-links">
              <Link to="/dashboard">📊 Dashboard</Link>
              <Link to="/map">🗺️ Crisis Map</Link>
              <Link to="/ask">💬 Ask AI</Link>
              <Link to="/profile">👤 Profile</Link>
              <Link to="/about">ℹ️ About</Link>
            </div>
          </div>

          {/* Architecture Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Architecture</h4>
            <div className="footer-links">
              <span className="footer-tech-item">
                <span className="footer-tech-dot"></span> React 19 + Vite
              </span>
              <span className="footer-tech-item">
                <span className="footer-tech-dot"></span> Node.js + Express
              </span>
              <span className="footer-tech-item">
                <span className="footer-tech-dot"></span> Open-Weight AI (Gemma 2)
              </span>
              <span className="footer-tech-item">
                <span className="footer-tech-dot"></span> Leaflet + OpenStreetMap
              </span>
              <span className="footer-tech-item">
                <span className="footer-tech-dot"></span> MongoDB Atlas
              </span>
            </div>
          </div>

          {/* Trust Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Trust Model</h4>
            <div className="footer-trust-badges">
              <span className="footer-trust-item">
                <span className="status-badge confirmed" style={{ fontSize: '0.625rem' }}>CONFIRMED</span>
                <span>Official sources</span>
              </span>
              <span className="footer-trust-item">
                <span className="status-badge reported" style={{ fontSize: '0.625rem' }}>REPORTED</span>
                <span>Single source</span>
              </span>
              <span className="footer-trust-item">
                <span className="status-badge unverified" style={{ fontSize: '0.625rem' }}>UNCERTAIN</span>
                <span>Unverified</span>
              </span>
              <span className="footer-trust-item">
                <span className="status-badge conflicting" style={{ fontSize: '0.625rem' }}>CONFLICT</span>
                <span>Sources disagree</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>Built for the <strong>Hacktoberfest 2026</strong> DEV Challenge: "Build for a Friend"</span>
          </div>
          <div className="footer-bottom-right">
            <span className="footer-disclaimer">
              ⚠️ Not an emergency authority — organizes information only
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
