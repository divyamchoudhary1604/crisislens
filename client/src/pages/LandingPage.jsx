import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoAPI } from '../services/api';

export default function LandingPage({ onDemoStart }) {
  const navigate = useNavigate();
  const [loadingScenario, setLoadingScenario] = useState(null);

  async function handleStartScenario(scenarioId) {
    try {
      setLoadingScenario(scenarioId);
      await demoAPI.start(scenarioId);
      if (onDemoStart) onDemoStart();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to start demo scenario:', err);
      alert('Failed to start demo. Ensure backend is running.');
    } finally {
      setLoadingScenario(null);
    }
  }

  const architectureSteps = [
    'Multi-Source Ingestion (official bulletins, news, citizen dispatches)',
    'Text Cleaning & Entity Extraction',
    'AI Incident Extraction & Event Profiling',
    'Deduplication & Multi-Report Clustering',
    'Contradiction Detection & Timestamp Authority Resolution',
    'Uncertainty & Knowledge Gap Isolation',
    'Four-Tier Trust Classification (Confirmed vs. Reported vs. Uncertain)',
    'Action Derivation with Explicit Urgency & Factual Basis',
    'Personalized Spatial Intersection (Home, Commute Corridor, Destination)',
    'Interactive Transparent Intelligence Briefing & Leaflet Projection',
  ];

  return (
    <div className="landing-page fade-in">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <span>🛡️</span> Hacktoberfest 2026 — DEV “Build for a Friend” Challenge
        </div>

        <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          CrisisLens
        </h1>

        <p className="hero-subtitle" style={{ maxWidth: '780px', margin: '0 auto 2.5rem', fontSize: '1.125rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          Transform scattered crisis information into <strong style={{ color: '#fff' }}>clear, trustworthy context and personalized action</strong>. 
          Built for real people facing real emergencies, anchored in source transparency with zero AI hallucination.
        </p>

        {/* 3 Interactive Scenario Launchers */}
        <div style={{ maxWidth: '960px', margin: '0 auto 3rem' }}>
          <div style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>
            ⚡ Launch Live Crisis Intelligence Scenarios:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', textAlign: 'left' }}>
            {/* Scenario 1: Mohali */}
            <div 
              className="card"
              style={{
                cursor: 'pointer',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                transition: 'all 0.25s ease',
              }}
              onClick={() => handleStartScenario('mohali')}
            >
              <div className="card-body" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🌊</span>
                  <span className="status-badge reported" style={{ fontSize: '0.625rem' }}>URBAN FLOODING</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                  Mohali Monsoon Floods
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Built for <strong>Arjun</strong> (Student, Chandigarh University)
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Airport Road waterlogging conflict, stalled vehicles, and safe Kharar bypass derivation.
                </p>
                <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  {loadingScenario === 'mohali' ? 'Synthesizing...' : 'Launch Arjun\'s Brief →'}
                </button>
              </div>
            </div>

            {/* Scenario 2: Delhi Smog */}
            <div 
              className="card"
              style={{
                cursor: 'pointer',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                transition: 'all 0.25s ease',
              }}
              onClick={() => handleStartScenario('delhi')}
            >
              <div className="card-body" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🌫️</span>
                  <span className="status-badge conflicting" style={{ fontSize: '0.625rem' }}>AQI 480+ HAZARD</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                  Delhi-NCR Toxic Smog
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Built for <strong>Priya</strong> (Asthma Patient, Gurugram Commuter)
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Severe AQI spike, GRAP-IV road bans, and life-critical Metro rail alternative advice.
                </p>
                <button className="btn btn-secondary btn-sm" style={{ width: '100%', borderColor: '#f59e0b', color: '#fbbf24' }}>
                  {loadingScenario === 'delhi' ? 'Synthesizing...' : 'Launch Priya\'s Brief →'}
                </button>
              </div>
            </div>

            {/* Scenario 3: Uttarakhand */}
            <div 
              className="card"
              style={{
                cursor: 'pointer',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                transition: 'all 0.25s ease',
              }}
              onClick={() => handleStartScenario('uttarakhand')}
            >
              <div className="card-body" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>⛰️</span>
                  <span className="status-badge conflicting" style={{ fontSize: '0.625rem' }}>HIGHWAY LANDSLIDE</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                  Mountain Cloudburst & Landslide
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Built for <strong>Vikram</strong> (Traveller on NH-7 Highway)
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Pagal Nala mountain blockade, continuous sliding alerts, and train re-booking directives.
                </p>
                <button className="btn btn-secondary btn-sm" style={{ width: '100%', borderColor: '#ef4444', color: '#f87171' }}>
                  {loadingScenario === 'uttarakhand' ? 'Synthesizing...' : 'Launch Vikram\'s Brief →'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', padding: '1.5rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', maxWidth: '900px', margin: '0 auto' }}>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-blue)' }}>4-Tier</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trust Classification</div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>10-Step</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Synthesis Pipeline</div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#22c55e' }}>0 Hallucination</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grounded Primary Sources</div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>100% Resilient</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MongoDB Atlas + Offline Store</div>
          </div>
        </div>
      </section>

      {/* The Problem: Chaos vs Clarity */}
      <section className="landing-section">
        <div className="section-label">The Core Dilemma</div>
        <h2 className="section-title">Information exists. Context doesn't.</h2>
        <p className="section-text">
          During floods, severe weather, or infrastructure breakdowns, citizens don't suffer from a lack of information — 
          they suffer from <strong>information fragmentation and panic</strong>.
        </p>

        {/* Side-by-Side Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(69, 10, 10, 0.15)' }}>
            <div className="card-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.2)' }}>
              <h3 className="card-title" style={{ color: '#f87171' }}>❌ Without CrisisLens: Fragmented Chaos</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                📱 <strong>WhatsApp Forward:</strong> "Dam broke! Water heading to Sector 70! Forward to everyone!" (Unverified panic)
              </div>
              <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                📰 <strong>Outdated News:</strong> "Airport Road open with light waterlogging" (Published 3 hours ago)
              </div>
              <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                🐦 <strong>Police Tweet:</strong> "Advisory: Airport Road closed" (Buried in timeline)
              </div>
              <div style={{ color: '#fca5a5', fontWeight: 600, marginTop: '0.5rem' }}>
                Result: Paralyzed, confused, risking stranded vehicles.
              </div>
            </div>
          </div>

          <div className="card" style={{ borderColor: 'rgba(34, 197, 94, 0.3)', background: 'rgba(5, 150, 105, 0.1)' }}>
            <div className="card-header" style={{ borderBottomColor: 'rgba(34, 197, 94, 0.2)' }}>
              <h3 className="card-title" style={{ color: '#86efac' }}>✅ With CrisisLens: Trustworthy Context</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                🎯 <strong>Personalized:</strong> "Home in Sector 70 has knee-deep water. Usual college route is blocked."
              </div>
              <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                ⚠️ <strong>Conflict Resolved:</strong> "Police 10:42 AM closure supersedes 10:05 AM community passability report."
              </div>
              <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                ⚡ <strong>Action Plan:</strong> "Take Kharar bypass if travel is essential. Keep emergency contacts ready."
              </div>
              <div style={{ color: '#86efac', fontWeight: 600, marginTop: '0.5rem' }}>
                Result: Calm, decisive, safe transit based on facts.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Architecture */}
      <section className="landing-section" id="how-it-works">
        <div className="section-label">The AI Pipeline</div>
        <h2 className="section-title">10-Step Deterministic Crisis Synthesis</h2>
        <p className="section-text">
          CrisisLens avoids simple chat completions. Raw text feeds are parsed, cross-examined for contradictions, 
          and audited before reaching the citizen.
        </p>
        
        <div className="architecture-flow">
          {architectureSteps.map((step, i) => (
            <div key={i}>
              <div className="arch-step">
                <div className="arch-step-number">{i + 1}</div>
                <div className="arch-step-text">{step}</div>
              </div>
              {i < architectureSteps.length - 1 && <div className="arch-arrow"></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="landing-section">
        <div className="section-label">Verification Framework</div>
        <h2 className="section-title">Four-Tier Confidence Protocol</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🟢</div>
            <div className="feature-title">CONFIRMED</div>
            <div className="feature-description">
              Backed by official administrative advisories, police dispatches, or multi-source consensus.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🟡</div>
            <div className="feature-title">REPORTED</div>
            <div className="feature-description">
              From recognized local journalists or community eyewitnesses, awaiting secondary confirmation.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚪</div>
            <div className="feature-title">UNCERTAIN</div>
            <div className="feature-description">
              Critical gaps in data, rapidly fluctuating conditions, or unverified claims explicitly flagged.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔴</div>
            <div className="feature-title">CONFLICTING</div>
            <div className="feature-description">
              Direct source contradictions highlighted with timestamps, so the user knows who said what and when.
            </div>
          </div>
        </div>
      </section>

      {/* Open Source & Tech Stack */}
      <section className="landing-section">
        <div className="section-label">Tech Stack</div>
        <h2 className="section-title">Built with Production-Ready Open Standards</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">⚛️</div>
            <div className="feature-title">React 19 + Vite</div>
            <div className="feature-description">
              Ultra-responsive component architecture, Leaflet geospatial mapping, and client-side audio broadcast.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🍃</div>
            <div className="feature-title">MongoDB Atlas</div>
            <div className="feature-description">
              Cloud persistence for incidents, multi-source records, citizen reports, and user location profiles.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <div className="feature-title">Gemma 2 Open AI</div>
            <div className="feature-description">
              Open-weights LLM support (via Groq/OpenRouter/Ollama) with deterministic zero-API-key fallback.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <div className="feature-title">Ethical Safeguards</div>
            <div className="feature-description">
              Strict rate limiting, Helmet security headers, sanitized HTML, and permanent credential git-guards.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
