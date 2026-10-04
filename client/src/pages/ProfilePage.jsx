import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await userAPI.get();
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <div className="empty-title">Profile not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">
          CrisisLens is personalized around your saved locations and daily route.
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Basic Info */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">👤 {user.name}</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '2px' }}>
                  Language
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  {user.preferredLanguage === 'en' ? 'English' : user.preferredLanguage}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Locations */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📍 Saved Locations</h3>
          </div>
          <div className="card-body">
            <div className="personal-impact">
              {user.locations?.map((loc, i) => (
                <div key={i} className="impact-item">
                  <span className="impact-icon">
                    {loc.type === 'home' ? '🏠' : loc.type === 'college' ? '🎓' : loc.type === 'work' ? '💼' : '📍'}
                  </span>
                  <div className="impact-content">
                    <div className="impact-label">{loc.name}</div>
                    <div className="impact-description">{loc.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                      {loc.latitude?.toFixed(4)}, {loc.longitude?.toFixed(4)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Route */}
        {user.route && (
          <div className="card full-width">
            <div className="card-header">
              <h3 className="card-title">🛣️ Daily Route</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="impact-item" style={{ flex: 1, minWidth: '200px' }}>
                  <span className="impact-icon">🏠</span>
                  <div className="impact-content">
                    <div className="impact-label">From: {user.route.from}</div>
                    <div className="impact-description">
                      {user.locations?.find(l => l.type === user.route.from)?.label || user.route.from}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>→</div>
                <div className="impact-item" style={{ flex: 1, minWidth: '200px' }}>
                  <span className="impact-icon">🎓</span>
                  <div className="impact-content">
                    <div className="impact-label">To: {user.route.to}</div>
                    <div className="impact-description">
                      {user.locations?.find(l => l.type === user.route.to)?.label || user.route.to}
                    </div>
                  </div>
                </div>
              </div>
              {user.route.waypoints?.length > 0 && (
                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Route waypoints: {user.route.waypoints.length} points tracked
                </div>
              )}
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="card full-width">
          <div className="card-header">
            <h3 className="card-title">🔒 Privacy</h3>
          </div>
          <div className="card-body">
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>What is stored:</strong> Your name, saved locations, preferred language, and daily route. 
                This data is stored in the database and used to personalize crisis information for you.
              </p>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>What is sent to external services:</strong> When using a hosted AI model, 
                crisis source text is sent to the model provider for analysis. Your personal locations 
                are included in the personalization prompt.
              </p>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>What can be processed locally:</strong> The architecture supports running the AI 
                model locally via Ollama, which would keep all data on your machine. This is not the 
                default configuration but is supported.
              </p>
              <p>
                <strong>How locations are used:</strong> Your home, college, and route coordinates are 
                compared against incident locations to determine which events are relevant to you. 
                This comparison happens server-side.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
