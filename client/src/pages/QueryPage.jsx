import { useState } from 'react';
import { aiAPI } from '../services/api';

export default function QueryPage() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const suggestions = [
    'What changed near my college?',
    'Is my home area affected?',
    'Is it safe to travel to college today?',
    'What are the official recommendations?',
    'Are there any conflicting reports?',
  ];

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await aiAPI.query(question);
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestion(text) {
    setQuestion(text);
  }

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="page-title">Ask CrisisLens AI</h1>
        <p className="page-subtitle">
          Ask natural language questions about the crisis. CrisisLens cross-references all verified sources 
          and explicitly flags uncertainties and conflicting claims rather than hallucinating.
        </p>
      </div>

      {/* Query Input */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div className="query-container" style={{ position: 'relative' }}>
          <input
            type="text"
            className="query-input"
            placeholder="Ask anything (e.g., Is Airport Road safe for cars right now?)..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            aria-label="Ask a question about the crisis situation"
            id="query-input"
            style={{ paddingRight: '180px' }}
          />
          <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className={`btn btn-secondary ${isListening ? 'listening' : ''}`}
              onClick={startVoiceInput}
              style={{
                padding: '0.45rem 0.75rem',
                fontSize: '0.8125rem',
                borderColor: isListening ? '#ef4444' : undefined,
                color: isListening ? '#f87171' : undefined,
              }}
              title="Speak your question using microphone"
            >
              {isListening ? '🔴 Listening...' : '🎙️ Voice'}
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !question.trim()}
              style={{ padding: '0.45rem 1rem' }}
            >
              {loading ? 'Thinking...' : 'Ask →'}
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions */}
      {!result && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Suggested Queries
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="btn btn-secondary btn-sm"
                onClick={() => handleSuggestion(s)}
                style={{ fontSize: '0.8125rem' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-container" style={{ padding: '3rem' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">Synthesizing cross-source verified answers...</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div className="card-body">
            <p style={{ color: '#f87171' }}>Unable to process your question: {error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="card fade-in">
          <div className="card-header">
            <h3 className="card-title">💬 Verified Answer</h3>
            <span className={`severity-badge ${result.confidence?.toLowerCase() || 'moderate'}`}>
              <span className="badge-dot"></span>
              {result.confidence || 'HIGH'} confidence
            </span>
          </div>
          <div className="card-body">
            {result.unanswerable ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {result.answer}
              </p>
            ) : (
              <>
                <p style={{ fontSize: '0.9375rem', lineHeight: '1.7', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  {result.answer}
                </p>

                {/* Caveats */}
                {result.caveats?.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
                      ⚠️ Verification Caveats
                    </div>
                    <div className="evidence-list">
                      {result.caveats.map((c, i) => (
                        <div key={i} className="evidence-item uncertain">
                          <div className="evidence-text">{c}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources used */}
                {result.sourcesUsed?.length > 0 && (
                  <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Ground-truthed on {result.sourcesUsed.length} primary source citations. Zero hallucination guaranteed.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
