import { getSeverityClass, getSeverityLabel } from '../../utils/helpers';

export default function SeverityBadge({ severity, showLabel = false }) {
  const cls = getSeverityClass(severity);

  return (
    <span className={`severity-badge ${cls}`} role="status" aria-label={`Severity: ${getSeverityLabel(severity)}`}>
      <span className="badge-dot" aria-hidden="true"></span>
      <span>{severity}</span>
      {showLabel && <span> — {getSeverityLabel(severity).split(' — ')[1]}</span>}
    </span>
  );
}
