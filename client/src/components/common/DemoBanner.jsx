import { useState } from 'react';
import { demoAPI } from '../../services/api';

export default function DemoBanner({ active, onScenarioChange, onReset }) {
  const [selectedScenario, setSelectedScenario] = useState('mohali');
  const [loading, setLoading] = useState(false);

  if (!active) return null;

  async function handleSwitch(scenarioId) {
    if (loading || scenarioId === selectedScenario) return;
    try {
      setLoading(true);
      setSelectedScenario(scenarioId);
      await demoAPI.start(scenarioId);
      if (onScenarioChange) onScenarioChange(scenarioId);
      window.location.reload();
    } catch (err) {
      console.error('Failed to switch scenario:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (loading) return;
    try {
      setLoading(true);
      await demoAPI.reset();
      if (onReset) onReset();
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to reset demo:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="demo-banner-advanced" role="alert" aria-live="polite">
      <div className="banner-left">
        <span className="banner-tag">DEMO MODE</span>
        <span className="banner-text">Simulated crisis intelligence for Hacktoberfest 2026</span>
      </div>

      <div className="banner-scenarios">
        <span className="scenario-label">Switch Disaster:</span>
        <button
          className={`scenario-btn ${selectedScenario === 'mohali' ? 'active' : ''}`}
          onClick={() => handleSwitch('mohali')}
          disabled={loading}
          title="Mohali Urban Monsoon Flooding (Friend: Arjun)"
        >
          🌊 Mohali Floods
        </button>
        <button
          className={`scenario-btn ${selectedScenario === 'delhi' ? 'active' : ''}`}
          onClick={() => handleSwitch('delhi')}
          disabled={loading}
          title="Delhi Hazardous Smog & AQI 480+ Emergency (Friend: Priya)"
        >
          🌫️ Delhi Smog
        </button>
        <button
          className={`scenario-btn ${selectedScenario === 'uttarakhand' ? 'active' : ''}`}
          onClick={() => handleSwitch('uttarakhand')}
          disabled={loading}
          title="Mountain Cloudburst & NH-7 Highway Landslide (Friend: Vikram)"
        >
          ⛰️ Mountain Slide
        </button>
      </div>

      <div className="banner-actions">
        <button className="banner-reset-btn" onClick={handleReset} disabled={loading}>
          ↺ Reset Demo
        </button>
      </div>
    </div>
  );
}
