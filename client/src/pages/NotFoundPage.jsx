import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-container fade-in">
      <div className="empty-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-icon" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🧭</div>
        <h1 className="empty-title" style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          404 — Page Not Found
        </h1>
        <p className="empty-description" style={{ maxWidth: '480px', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          The crisis intelligence page or resource you are looking for does not exist or has been relocated.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary">
            Home
          </Link>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
