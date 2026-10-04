import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { incidentAPI, userAPI, reportAPI } from '../services/api';
import SeverityBadge from '../components/incidents/SeverityBadge';
import { formatTime, formatDateTime, getSourceIcon } from '../utils/helpers';

export default function DashboardPage() {
  const [incidents, setIncidents] = useState([]);
  const [personalization, setPersonalization] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  // Audio Broadcast State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Citizen Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('flooding');
  const [reportLocation, setReportLocation] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  function showToastMessage(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }

  async function loadDashboard() {
    try {
      setLoading(true);
      const [incidentRes, userRes] = await Promise.all([
        incidentAPI.list(),
        userAPI.get(),
      ]);

      setIncidents(incidentRes.data || []);
      setPersonalization(incidentRes.personalization || null);
      setUser(userRes.data || null);
      setIsDemo(incidentRes.isDemo || false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Audio Emergency Broadcast using Web Speech API
  function toggleAudioBroadcast() {
    if (!('speechSynthesis' in window)) {
      showToastMessage('Speech synthesis not supported in this browser.', 'error');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const primary = incidents[0];
    if (!primary) return;

    let textToSpeak = `Crisis alert for ${user?.name || 'citizen'}. `;
    textToSpeak += `Severity level: ${primary.severity}. `;
    textToSpeak += `${primary.title}. `;
    textToSpeak += `${primary.summary}. `;

    if (personalization?.personalSummary) {
      textToSpeak += `Personal impact notice: ${personalization.personalSummary}. `;
    }

    if (primary.recommendedActions?.length > 0) {
      textToSpeak += `Immediate recommended actions: `;
      primary.recommendedActions.slice(0, 3).forEach((a, i) => {
        textToSpeak += `Action ${i + 1}: ${a.action}. `;
      });
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95; // Calm, emergency broadcast speed
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    showToastMessage('Emergency audio briefing playing...');
  }

  // Submit Citizen Report
  async function handleReportSubmit(e) {
    e.preventDefault();
    if (!reportLocation.trim() || !reportDescription.trim()) {
      showToastMessage('Please provide both location and hazard details.', 'error');
      return;
    }

    try {
      setSubmittingReport(true);
      await reportAPI.submit({
        type: reportType,
        location: { name: reportLocation.trim() },
        description: reportDescription.trim(),
      });

      setShowReportModal(false);
      setReportLocation('');
      setReportDescription('');
      showToastMessage('Citizen report submitted and logged to crisis database!');
    } catch (err) {
      showToastMessage(err.message || 'Failed to submit report', 'error');
    } finally {
      setSubmittingReport(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading crisis intelligence...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <div className="empty-title">Unable to load dashboard</div>
          <div className="empty-description">{error}</div>
          <button className="btn btn-primary" onClick={loadDashboard} style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasIncidents = incidents.length > 0;
  const incident = incidents[0]; // Primary incident

  return (
    <div className="page-container fade-in">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">Crisis Dashboard</h1>
            <p className="page-subtitle">
              {user ? `Personalized brief for ${user.name}` : 'Emergency intelligence'} 
              {user?.locations?.[0] && ` · ${user.locations[0].label}`}
              {incident && ` · Last updated: ${formatTime(incident.updatedAt)}`}
            </p>
          </div>
          {hasIncidents && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Audio Emergency Broadcast Player */}
              <button
                className={`audio-broadcast-btn ${isSpeaking ? 'playing' : ''}`}
                onClick={toggleAudioBroadcast}
                title={isSpeaking ? 'Stop audio briefing' : 'Play emergency voice briefing'}
              >
                {isSpeaking ? (
                  <>
                    <span className="soundwave">
                      <span className="soundwave-bar"></span>
                      <span className="soundwave-bar"></span>
                      <span className="soundwave-bar"></span>
                      <span className="soundwave-bar"></span>
                    </span>
                    <span>Stop Audio Brief</span>
                  </>
                ) : (
                  <>
                    <span>🔊</span>
                    <span>Listen to Audio Brief</span>
                  </>
                )}
              </button>

              {/* Citizen Hazard Report Button */}
              <button
                className="btn btn-secondary"
                onClick={() => setShowReportModal(true)}
                style={{ fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}
              >
                📢 Report Hazard
              </button>

              {/* Print / Export Action Plan */}
              <button
                className="btn btn-secondary"
                onClick={() => window.print()}
                style={{ fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}
                title="Print or export as PDF action plan"
              >
                🖨️ Export / Print
              </button>

              <SeverityBadge severity={incident.severity} showLabel />
            </div>
          )}
        </div>
      </div>

      {!hasIncidents ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No active incidents</div>
          <div className="empty-description">
            No crisis information found for your monitored areas. Start the demo scenario above to see CrisisLens in action.
          </div>
        </div>
      ) : (
        <div className="dashboard-grid">
          {/* Situation Brief */}
          <div className={`situation-brief severity-${incident.severity?.toLowerCase()} full-width fade-in fade-in-delay-1`}>
            <div className="brief-header">
              <div>
                <div className="brief-label">Current Situation</div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {incident.title}
                </h2>
              </div>
              <SeverityBadge severity={incident.severity} />
            </div>
            <p className="brief-summary">{incident.summary}</p>
            
            {/* Severity Factors */}
            {incident.severityFactors?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div className="brief-label" style={{ marginBottom: '0.5rem' }}>Why this severity level</div>
                <div className="severity-factors">
                  {incident.severityFactors.map((factor, i) => (
                    <span key={i} className="severity-factor">
                      <span className="factor-icon">✓</span> {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* What Matters To You */}
          {personalization && (
            <div className="card fade-in fade-in-delay-2">
              <div className="card-header">
                <h3 className="card-title">🎯 What Matters To You</h3>
              </div>
              <div className="card-body">
                {personalization.personalSummary && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
                    {personalization.personalSummary}
                  </p>
                )}
                <div className="personal-impact">
                  {personalization.affectedLocations?.map((loc, i) => (
                    <div key={i} className="impact-item">
                      <span className="impact-icon">{loc.icon}</span>
                      <div className="impact-content">
                        <div className="impact-label">{loc.locationName}</div>
                        <div className="impact-description">{loc.explanation}</div>
                        <div className="impact-level">
                          <SeverityBadge severity={loc.impactLevel} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {incident.recommendedActions?.length > 0 && (
            <div className="card fade-in fade-in-delay-3">
              <div className="card-header">
                <h3 className="card-title">⚡ What You Should Do</h3>
              </div>
              <div className="card-body">
                <ul className="actions-list">
                  {incident.recommendedActions.map((action, i) => (
                    <li key={i} className="action-item">
                      <span className="action-icon" aria-hidden="true">
                        {action.urgency === 'HIGH' ? '🔴' : action.urgency === 'MODERATE' ? '🟠' : '🟡'}
                      </span>
                      <div className="action-text">
                        {action.action}
                        <span className="action-basis">Based on: {action.basis}</span>
                      </div>
                      <SeverityBadge severity={action.urgency} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Confirmed Facts */}
          {incident.confirmedFacts?.length > 0 && (
            <div className="card fade-in fade-in-delay-2">
              <div className="card-header">
                <h3 className="card-title">✅ What We Know (Confirmed)</h3>
              </div>
              <div className="card-body">
                <div className="evidence-list">
                  {incident.confirmedFacts.map((fact, i) => (
                    <div key={i} className="evidence-item confirmed">
                      <div className="evidence-text">{fact.fact}</div>
                      <div className="evidence-meta">
                        <span className="status-badge confirmed">CONFIRMED</span>
                        {' · '}
                        Sources: {Array.isArray(fact.sources) ? fact.sources.join(', ') : fact.sources}
                        {fact.lastUpdated && ` · ${formatTime(fact.lastUpdated)}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reported Information */}
          {incident.reportedInformation?.length > 0 && (
            <div className="card fade-in fade-in-delay-3">
              <div className="card-header">
                <h3 className="card-title">📋 What Is Reported (Not Fully Confirmed)</h3>
              </div>
              <div className="card-body">
                <div className="evidence-list">
                  {incident.reportedInformation.map((info, i) => (
                    <div key={i} className="evidence-item reported">
                      <div className="evidence-text">{info.claim}</div>
                      <div className="evidence-meta">
                        <span className="status-badge reported">REPORTED</span>
                        {' · '}Source: {info.source}
                        {info.reportedAt && ` · ${formatTime(info.reportedAt)}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Uncertainties */}
          {incident.uncertainties?.length > 0 && (
            <div className="card fade-in fade-in-delay-4">
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
            <div className="full-width fade-in fade-in-delay-4">
              {incident.conflictingReports.map((conflict, i) => (
                <div key={i} className="conflict-card" style={{ marginBottom: '1rem' }}>
                  <div className="conflict-header">
                    <span>⚠️</span>
                    <span>Conflicting Reports: {conflict.claim}</span>
                  </div>
                  <div className="conflict-body">
                    <div className="conflict-source">
                      <div className="conflict-source-label">Source A</div>
                      <div className="conflict-source-text">{conflict.sourceA?.says}</div>
                      <div className="conflict-source-time">
                        {conflict.sourceA?.sourceId} · {conflict.sourceA?.time && formatTime(conflict.sourceA.time)}
                      </div>
                    </div>
                    <div className="conflict-source">
                      <div className="conflict-source-label">Source B</div>
                      <div className="conflict-source-text">{conflict.sourceB?.says}</div>
                      <div className="conflict-source-time">
                        {conflict.sourceB?.sourceId} · {conflict.sourceB?.time && formatTime(conflict.sourceB.time)}
                      </div>
                    </div>
                    {conflict.note && (
                      <div className="conflict-note">
                        <strong>CrisisLens Analysis:</strong> {conflict.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View Full Details */}
          <div className="full-width" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <Link to={`/incident/${incident.id}`} className="btn btn-secondary">
              View Full Incident Details & Citations →
            </Link>
          </div>
        </div>
      )}

      {/* Citizen Hazard Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <span>📢</span>
                <span>Submit Citizen Hazard Report</span>
              </h3>
              <button className="modal-close-btn" onClick={() => setShowReportModal(false)}>✕</button>
            </div>
            <form onSubmit={handleReportSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Your eyewitness dispatch will be logged into the CrisisLens intelligence database and analyzed against official sources.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    HAZARD TYPE
                  </label>
                  <select
                    className="form-control"
                    value={reportType}
                    onChange={e => setReportType(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="flooding">Waterlogging / Flooding</option>
                    <option value="traffic">Road Blockage / Accident</option>
                    <option value="storm">Storm Damage / Fallen Trees</option>
                    <option value="infrastructure">Power / Water Failure</option>
                    <option value="health">Hazardous Smog / Air Quality</option>
                    <option value="other">Other Emergency</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    EXACT LOCATION / LANDMARK
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Airport Road near Sector 70 roundabout"
                    value={reportLocation}
                    onChange={e => setReportLocation(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    WHAT DID YOU OBSERVE?
                  </label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Describe water depth, vehicle passability, or current danger..."
                    value={reportDescription}
                    onChange={e => setReportDescription(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-input)', color: '#fff', border: '1px solid var(--border-color)', padding: '0.6rem', borderRadius: 'var(--radius-md)', resize: 'vertical' }}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)} disabled={submittingReport}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submittingReport}>
                  {submittingReport ? 'Submitting...' : 'Submit to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
