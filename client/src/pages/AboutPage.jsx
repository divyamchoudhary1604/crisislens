import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="page-title">About CrisisLens</h1>
        <p className="page-subtitle">
          An open-source AI crisis information assistant — built for one person, designed with transparency at its core.
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Mission */}
        <div className="card full-width fade-in fade-in-delay-1">
          <div className="card-header">
            <h3 className="card-title">🎯 Mission</h3>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1rem' }}>
              During a crisis, information exists but understanding doesn't. Your friend receives 
              a weather warning, a news article, a government update, a WhatsApp forward, and a 
              local road-closure report. Five pieces of information — but they still ask:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {[
                '"Does this affect me?"',
                '"Which information is confirmed?"',
                '"What should I actually do?"',
              ].map((q, i) => (
                <div key={i} style={{ 
                  padding: '0.5rem 1rem', 
                  background: 'var(--bg-elevated)', 
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--accent-blue)',
                  fontSize: '0.875rem',
                  fontStyle: 'italic',
                  color: 'var(--text-primary)',
                }}>
                  {q}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              CrisisLens answers these questions by processing multiple sources through an AI pipeline 
              that extracts, classifies, deduplicates, detects contradictions, and generates a 
              personalized situation brief — all with full source transparency.
            </p>
          </div>
        </div>

        {/* Built For */}
        <div className="card fade-in fade-in-delay-2">
          <div className="card-header">
            <h3 className="card-title">👤 Built for a Friend</h3>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
              CrisisLens was built for one specific person — a friend named Arjun who lives in 
              Mohali and studies at Chandigarh University. The dashboard is personalized around 
              his home, his college, and his daily commute route.
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
              When a crisis happens, the system answers <em>his</em> question: "How does this 
              affect <em>me</em>?"
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
              The architecture is designed to eventually be adapted for other users, but the first 
              user is a real person with a real problem.
            </p>
          </div>
        </div>

        {/* Open-Source AI */}
        <div className="card fade-in fade-in-delay-2">
          <div className="card-header">
            <h3 className="card-title">🤖 Why Open-Source AI</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: '🔒', title: 'Privacy', text: 'Personal locations don\'t need to go to third-party AI. Open models can run locally.' },
                { icon: '🔧', title: 'Control', text: 'If the model produces bad outputs, we can evaluate, fine-tune, or replace it. No vendor lock-in.' },
                { icon: '🌐', title: 'Resilience', text: 'Local deployment support means the tool could work even when internet is degraded.' },
                { icon: '💰', title: 'Cost', text: 'Emergency tools shouldn\'t have costs that scale with crisis severity.' },
              ].map((item, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  gap: '0.75rem', 
                  alignItems: 'flex-start',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '2px' }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Pipeline */}
        <div className="card full-width fade-in fade-in-delay-3">
          <div className="card-header">
            <h3 className="card-title">⚙️ 10-Step AI Pipeline</h3>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              CrisisLens doesn't just show you articles. Every piece of information passes through a 
              structured pipeline:
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '0.5rem',
            }}>
              {[
                { num: 1, text: 'Multi-Source Ingestion' },
                { num: 2, text: 'Data Cleaning & Normalization' },
                { num: 3, text: 'AI Incident Extraction' },
                { num: 4, text: 'Classification & Entity Detection' },
                { num: 5, text: 'Duplicate Detection & Merging' },
                { num: 6, text: 'Contradiction Detection' },
                { num: 7, text: 'Uncertainty Extraction' },
                { num: 8, text: 'Severity Assessment' },
                { num: 9, text: 'Personalization' },
                { num: 10, text: 'Situation Synthesis' },
              ].map((step) => (
                <div key={step.num} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.75rem',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: 'white',
                    flexShrink: 0,
                  }}>
                    {step.num}
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Model */}
        <div className="card fade-in fade-in-delay-3">
          <div className="card-header">
            <h3 className="card-title">🛡️ Trust Model</h3>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
              CrisisLens never says "AI says this is true." Instead, every piece of information shows 
              its source, timestamp, verification status, and conflicts with other sources.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { badge: 'confirmed', label: 'Confirmed', desc: 'Backed by official sources or multiple reports' },
                { badge: 'reported', label: 'Reported', desc: 'From identifiable sources but not independently confirmed' },
                { badge: 'unverified', label: 'Uncertain', desc: 'Uses hedging language or comes from unverified reports' },
                { badge: 'conflicting', label: 'Conflicting', desc: 'When sources disagree — both sides are shown' },
              ].map((item, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  padding: '0.5rem',
                }}>
                  <span className={`status-badge ${item.badge}`} style={{ minWidth: '85px', justifyContent: 'center' }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="card fade-in fade-in-delay-3">
          <div className="card-header">
            <h3 className="card-title">🔧 Tech Stack</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { category: 'Frontend', items: 'React 19, React Router, Leaflet, Vite' },
                { category: 'Backend', items: 'Node.js, Express, Mongoose' },
                { category: 'AI Engine', items: 'Open-weight models (Gemma 2) via OpenRouter, Groq, or Ollama' },
                { category: 'Database', items: 'MongoDB Atlas (optional — works without it in demo)' },
                { category: 'Maps', items: 'Leaflet + OpenStreetMap' },
                { category: 'Architecture', items: 'Provider pattern for swappable AI, in-memory demo mode, JSON AI pipeline' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ 
                    fontSize: '0.6875rem', 
                    color: 'var(--text-muted)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em', 
                    fontWeight: 600, 
                    marginBottom: '2px',
                  }}>
                    {item.category}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                    {item.items}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Limitations */}
        <div className="card full-width fade-in fade-in-delay-4">
          <div className="card-header">
            <h3 className="card-title">⚠️ What CrisisLens Is Not</h3>
          </div>
          <div className="card-body">
            <div className="limitations-list">
              {[
                'Not an emergency authority — it does not issue alerts or evacuation orders',
                'Not a replacement for government disaster management systems',
                'Not a guaranteed truth detector — it organizes information, not verifies ground truth',
                'Not a predictive model — it does not forecast disasters',
                'Not a medical system — it does not provide health advice',
                'Not offline-capable in the current version — the architecture supports it, but it is not implemented',
              ].map((item, i) => (
                <div key={i} className="limitation-item">
                  <span className="limitation-icon" aria-hidden="true">✕</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ 
              marginTop: '1.5rem', 
              fontSize: '0.875rem', 
              color: 'var(--text-secondary)',
              padding: '0.75rem 1rem',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--accent-blue)',
            }}>
              <strong>CrisisLens's purpose:</strong> "Organizing available information and helping one person 
              understand what may be relevant to them."
            </p>
          </div>
        </div>

        {/* Hacktoberfest */}
        <div className="card full-width fade-in fade-in-delay-4">
          <div className="card-header">
            <h3 className="card-title">🎃 Hacktoberfest 2026</h3>
          </div>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
              CrisisLens was built for the <strong>Hacktoberfest 2026 DEV Challenge: "Build for a Friend"</strong>. 
              The challenge asks developers to build a project that solves a real problem for one real person, 
              with open-source AI at its core.
            </p>
            <Link to="/" className="btn btn-primary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
