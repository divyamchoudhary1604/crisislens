export function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
}

export function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function getSeverityClass(severity) {
  return (severity || '').toLowerCase();
}

export function getSeverityLabel(severity) {
  const labels = {
    LOW: 'Low — Monitoring',
    MODERATE: 'Moderate — Stay Alert',
    HIGH: 'High — Take Action',
    CRITICAL: 'Critical — Immediate Action',
  };
  return labels[severity] || severity;
}

export function getSourceIcon(type) {
  const icons = {
    OFFICIAL: '🏛️',
    NEWS: '📰',
    COMMUNITY: '👥',
    WEATHER_SERVICE: '🌦️',
    SOCIAL: '💬',
  };
  return icons[type] || '📄';
}

export function getStatusIcon(status) {
  const icons = {
    CONFIRMED: '✓',
    REPORTED: '○',
    UNVERIFIED: '?',
    CONFLICTING: '⚠',
  };
  return icons[status] || '•';
}

export function getEventTypeClass(type) {
  const classes = {
    CONTRADICTION_DETECTED: 'type-contradiction',
    REPORTS_MERGED: 'type-merge',
    SOURCE_ADDED: 'type-source',
    ANALYSIS_UPDATED: 'type-analysis',
  };
  return classes[type] || '';
}
