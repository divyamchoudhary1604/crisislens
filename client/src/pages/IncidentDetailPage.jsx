import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { incidentAPI } from '../services/api';
import SeverityBadge from '../components/incidents/SeverityBadge';
import { formatTime, formatDateTime, getSourceIcon, getEventTypeClass } from '../utils/helpers';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [sources, setSources] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [personalization, setPersonalization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadIncident();
  }, [id]);

  async function loadIncident() {
    try {
      setLoading(true);
      const [detailRes, timelineRes] = await Promise.all([
        incidentAPI.get(id),
        incidentAPI.timeline(id),
      ]);

      setIncident(detailRes.data);
      setSources(detailRes.sources || []);
      setPersonalization(detailRes.personalization || null);
      setTimeline(timelineRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading incident details...</div>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <div className="empty-title">Incident not found</div>
          <div className="empty-description">{error || 'This incident does not exist.'}</div>
          <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <Link to="/dashboard" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
          ← Back to Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h1 className="page-title">{incident.title}</h1>
            <p className="page-subtitle">
              {incident.type?.toUpperCase()} · {incident.status} · 
              Last updated: {formatDateTime(incident.updatedAt)}
            </p>
          </div>
          <SeverityBadge severity={incident.severity} showLabel />
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Situation Brief */}
        <div className={`situation-brief severity-${incident.severity?.toLowerCase()} full-width`}>
          <div className="brief-label">AI Situation Brief</div>
          <p className="brief-summary">{incident.summary}</p>
          {incident.severityFactors?.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div className="severity-factors">
                {incident.severityFactors.map((f, i) => (
                  <span key={i} className="severity-factor">
                    <span className="factor-icon">✓</span> {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirmed Facts */}
        {incident.confirmedFacts?.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">✅ What We Know</h3>
            </div>
            <div className="card-body">
              <div className="evidence-list">
                {incident.confirmedFacts.map((fact, i) => (
                  <div key={i} className="evidence-item confirmed">
                    <div className="evidence-text">{fact.fact}</div>
                    <div className="evidence-meta">
                      <span className="status-badge confirmed">CONFIRMED</span>
                      {' · '}Sources: {Array.isArray(fact.sources) ? fact.sources.join(', ') : fact.sources}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reported Only */}
        {incident.reportedInformation?.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">📋 What Is Only Reported</h3>
            </div>
            <div className="card-body">
              <div className="evidence-list">
                {incident.reportedInformation.map((info, i) => (
                  <div key={i} className="evidence-item reported">
                    <div className="evidence-text">{info.claim}</div>
                    <div className="evidence-meta">
                      <span className="status-badge reported">REPORTED</span>
                      {' · '}{info.source} · {formatTime(info.reportedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Uncertainties */}
        {incident.uncertainties?.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">❓ What Is Uncertain</h3>
            </div>
            <div className="card-body">
              <div className="evidence-list">
                {incident.uncertainties.map((u, i) => (
                  <div key={i} className="evidence-item uncertain">
                    <div className="evidence-text">{u.item}</div>
                    <div className="evidence-meta">
                      <span className="status-badge unverified">UNCERTAIN</span>
                      {u.reason && ` · ${u.reason}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conflicting Reports */}
        {incident.conflictingReports?.length > 0 && (
          <div className="full-width">
            <div className="card-header" style={{ background: 'transparent', border: 'none', padding: '0 0 1rem 0' }}>
              <h3 className="card-title">⚠️ Conflicting Information</h3>
            </div>
            {incident.conflictingReports.map((conflict, i) => (
              <div key={i} className="conflict-card" style={{ marginBottom: '1rem' }}>
                <div className="conflict-header">
                  <span>⚠️</span>
                  <span>{conflict.claim}</span>
                </div>
                <div className="conflict-body">
                  <div className="conflict-source">
                    <div className="conflict-source-label">{conflict.sourceA?.sourceId || 'Source A'}</div>
                    <div className="conflict-source-text">{conflict.sourceA?.says}</div>
                    <div className="conflict-source-time">{conflict.sourceA?.time && formatTime(conflict.sourceA.time)}</div>
                  </div>
                  <div className="conflict-source">
                    <div className="conflict-source-label">{conflict.sourceB?.sourceId || 'Source B'}</div>
                    <div className="conflict-source-text">{conflict.sourceB?.says}</div>
                    <div className="conflict-source-time">{conflict.sourceB?.time && formatTime(conflict.sourceB.time)}</div>
                  </div>
                  {conflict.note && (
                    <div className="conflict-note">
                      <strong>CrisisLens:</strong> {conflict.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommended Actions */}
        {incident.recommendedActions?.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">⚡ Recommended Actions</h3>
            </div>
            <div className="card-body">
              <ul className="actions-list">
                {incident.recommendedActions.map((action, i) => (
                  <li key={i} className="action-item">
                    <span className="action-icon" aria-hidden="true">
                      {action.urgency === 'HIGH' ? '🔴' : '🟠'}
                    </span>
                    <div className="action-text">
                      {action.action}
                      <span className="action-basis">Based on: {action.basis}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">🕐 What Changed</h3>
            </div>
            <div className="card-body">
              <div className="timeline">
                {timeline.map((event, i) => (
                  <div key={i} className={`timeline-item ${getEventTypeClass(event.type)}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-time">{formatTime(event.timestamp)}</div>
                    <div className="timeline-description">{event.description}</div>
                    {event.sourceId && (
                      <div className="timeline-source">Source: {event.sourceId}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">📚 Sources ({sources.length})</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sources.map((source, i) => (
                <div key={i} className="source-item">
                  <div className={`source-type-icon ${source.type?.toLowerCase()}`}>
                    {getSourceIcon(source.type)}
                  </div>
                  <div className="source-details">
                    <div className="source-title">{source.title?.replace('DEMO — ', '')}</div>
                    <div className="source-meta">
                      <span className="status-badge reported">{source.type}</span>
                      <span>{source.publisher}</span>
                      <span>{formatTime(source.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
