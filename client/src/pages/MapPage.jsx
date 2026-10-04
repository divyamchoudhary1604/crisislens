import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { mapAPI } from '../services/api';
import SeverityBadge from '../components/incidents/SeverityBadge';
import { formatTime } from '../utils/helpers';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in Leaflet + Vite
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const homeIcon = new L.DivIcon({
  html: '<div style="font-size:1.6rem;text-align:center;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">🏠</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const destinationIcon = new L.DivIcon({
  html: '<div style="font-size:1.6rem;text-align:center;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">🏢</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const incidentIcon = new L.DivIcon({
  html: '<div style="font-size:1.4rem;text-align:center;filter:drop-shadow(0 2px 6px rgba(239,68,68,0.7));">🚨</div>',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function MapPage() {
  const [incidents, setIncidents] = useState([]);
  const [userLocations, setUserLocations] = useState({ locations: [], route: null });
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  useEffect(() => {
    loadMapData();
  }, []);

  async function loadMapData() {
    try {
      const [incRes, locRes] = await Promise.all([
        mapAPI.incidents(),
        mapAPI.userLocations(),
      ]);
      setIncidents(incRes.data || []);
      setUserLocations(locRes.data || { locations: [], route: null });
    } catch (err) {
      console.error('Failed to load map data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Dynamic center based on active user locations or incident
  const primaryLoc = userLocations.locations?.[0];
  const center = (primaryLoc?.latitude && primaryLoc?.longitude)
    ? [primaryLoc.latitude, primaryLoc.longitude]
    : [30.7046, 76.7179]; // Default to Mohali

  const routePoints = userLocations.route?.waypoints?.map(w => [w.lat, w.lng]) || [];

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity === 'ALL') return true;
    return inc.severity === filterSeverity;
  });

  return (
    <div className="page-container fade-in">
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">Interactive Crisis Map</h1>
            <p className="page-subtitle">
              Live geospatial overlay plotting danger perimeters, confirmed road disruptions, and your personal commute corridor.
            </p>
          </div>

          {/* Filter Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>FILTER:</span>
            {['ALL', 'CRITICAL', 'HIGH'].map(sev => (
              <button
                key={sev}
                className={`btn btn-sm ${filterSeverity === sev ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterSeverity(sev)}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading geospatial intelligence...</div>
        </div>
      ) : (
        <div className="map-container" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', height: '580px' }}>
          <MapContainer 
            key={`${center[0]}-${center[1]}`}
            center={center} 
            zoom={12} 
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User's saved locations */}
            {userLocations.locations?.map((loc, i) => (
              <Marker 
                key={`user-${i}`}
                position={[loc.latitude, loc.longitude]}
                icon={loc.type === 'home' ? homeIcon : destinationIcon}
              >
                <Popup>
                  <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '160px', color: '#111' }}>
                    <strong style={{ fontSize: '0.9375rem' }}>{loc.type === 'home' ? '🏠' : '🏢'} {loc.name}</strong>
                    <br />
                    <span style={{ fontSize: '0.8125rem', color: '#444' }}>{loc.label}</span>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* User's route */}
            {routePoints.length > 1 && (
              <Polyline 
                positions={routePoints}
                pathOptions={{ 
                  color: '#3b82f6', 
                  weight: 4, 
                  opacity: 0.85,
                  dashArray: '8, 8',
                }}
              />
            )}

            {/* Incident markers */}
            {filteredIncidents.map((incident, i) => 
              incident.locations?.map((loc, j) => (
                <Marker
                  key={`incident-${i}-${j}`}
                  position={[loc.latitude, loc.longitude]}
                  icon={incidentIcon}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '220px', color: '#111' }}>
                      <strong style={{ fontSize: '0.9375rem' }}>{incident.title}</strong>
                      <div style={{ marginTop: '4px' }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontSize: '0.6875rem', 
                          fontWeight: 700,
                          background: incident.severity === 'CRITICAL' ? '#450a0a' : incident.severity === 'HIGH' ? '#fef2f2' : '#fffbeb',
                          color: incident.severity === 'CRITICAL' ? '#f87171' : incident.severity === 'HIGH' ? '#ef4444' : '#f59e0b',
                        }}>
                          {incident.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#333', marginTop: '4px' }}>
                        📍 {loc.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>
                        {incident.sourceCount} verified sources · {formatTime(incident.updatedAt)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))
            )}

            {/* Incident danger radius circles */}
            {filteredIncidents.map((incident, i) =>
              incident.locations?.map((loc, j) => (
                <Circle
                  key={`circle-${i}-${j}`}
                  center={[loc.latitude, loc.longitude]}
                  radius={1800}
                  pathOptions={{
                    color: incident.severity === 'CRITICAL' ? '#dc2626' : 
                           incident.severity === 'HIGH' ? '#ef4444' : '#f59e0b',
                    fillColor: incident.severity === 'CRITICAL' ? '#dc2626' : 
                               incident.severity === 'HIGH' ? '#ef4444' : '#f59e0b',
                    fillOpacity: 0.12,
                    weight: 2,
                  }}
                />
              ))
            )}
          </MapContainer>
        </div>
      )}

      {/* Map Legend */}
      <div style={{ marginTop: '1.25rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', padding: '0.75rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <span>🏠</span> Home Base
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <span>🏢</span> Destination (College / Workplace)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>- - -</span> Daily Transit Corridor
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <span>🚨</span> Hazard / Disruption Hotspot
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.4)', border: '1px solid #ef4444' }}></span> High Danger Perimeter
        </div>
      </div>
    </div>
  );
}
