import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { X, Calendar, MapPin, ShieldCheck } from 'lucide-react';

export default function AlertDetailModal() {
  const { selectedAlert, setSelectedAlert } = useCommandCenter();

  if (!selectedAlert) return null;

  const handleClose = () => {
    setSelectedAlert(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'OBSERVED': return 'badge-raw';
      case 'CORROBORATED': return 'badge-verified';
      case 'VERIFIED': return 'badge-intel-active';
      default: return 'badge-raw';
    }
  };

  const incidentType = selectedAlert.incident_type || selectedAlert.type || 'unknown';
  const busesObserved = selectedAlert.buses_observed || selectedAlert.busesObserved || 1;
  const busesList = selectedAlert.buses_list 
    ? (typeof selectedAlert.buses_list === 'string' ? selectedAlert.buses_list.split(',') : selectedAlert.buses_list)
    : (selectedAlert.busesList || []);
  const recommendedAction = selectedAlert.recommended_action || selectedAlert.recommendedAction || 'Recommended action scheduled.';
  const coordinates = selectedAlert.coordinates || [selectedAlert.latitude, selectedAlert.longitude] || [13.0067, 80.2206];
  const detailsText = selectedAlert.details || selectedAlert.detailsText || 'Initial observation registered.';

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title-group">
            <span className={`modal-status-badge ${getStatusBadgeClass(selectedAlert.status)}`}>
              {selectedAlert.status || 'OBSERVED'}
            </span>
            <h2 className="modal-title">{selectedAlert.title}</h2>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-grid">
          {/* Section 1: Main Overview (WHAT, WHERE, WHEN) */}
          <div className="modal-info-section">
            <div className="detail-row">
              <span className="detail-label">WHAT</span>
              <div className="detail-value">
                <span className="value-header">{selectedAlert.title}</span>
                <p className="value-desc">{detailsText}</p>
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-label">WHERE</span>
              <div className="detail-value">
                <div className="flex-align-center font-semibold">
                  <MapPin size={14} className="color-purple mr-1" />
                  <span className="value-header">{selectedAlert.location}</span>
                </div>
                <span className="coordinates-tag">GPS: {coordinates.join(', ')}</span>
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-label">WHEN</span>
              <div className="detail-value">
                <div className="flex-align-center font-semibold">
                  <Calendar size={14} className="color-purple mr-1" />
                  <span className="value-header">{selectedAlert.time}</span>
                </div>
                <span className="value-sub">Telemetries updated recently</span>
              </div>
            </div>
          </div>

          {/* Section 2: Metrics (CONFIDENCE, BUSES, IMPACT) */}
          <div className="modal-metrics-section">
            <div className="metric-box">
              <span className="metric-box-label">CONFIDENCE VALUE</span>
              <div className="metric-box-val-row">
                <span className="metric-box-val" style={{ color: incidentType === 'accident' ? '#ef4444' : '#7c3aed' }}>
                  {selectedAlert.confidence}%
                </span>
                <span className="metric-box-rating">VERIFIED</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${selectedAlert.confidence}%`, 
                    backgroundColor: incidentType === 'accident' ? '#ef4444' : '#7c3aed' 
                  }}
                ></div>
              </div>
            </div>

            <div className="metric-box">
              <span className="metric-box-label">NUMBER OF BUSES</span>
              <div className="metric-box-val-row">
                <span className="metric-box-val">{busesObserved}</span>
                <span className="metric-box-rating">INDEPENDENT NODES</span>
              </div>
              <div className="bus-chips-list">
                {busesList.map(bus => (
                  <span key={bus} className="bus-chip">{bus}</span>
                ))}
              </div>
            </div>

            <div className="metric-box">
              <span className="metric-box-label">TRANSIT IMPACT</span>
              <div className="metric-box-val-row">
                <span className="metric-box-impact-desc">{selectedAlert.impact}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Action & Verdict */}
        <div className="modal-action-section">
          <div className="action-header">
            <ShieldCheck size={18} className="color-green mr-1" />
            <span>RECOMMENDED COMMAND DISPATCH ACTION</span>
          </div>
          <p className="action-recommendation">
            {recommendedAction}
          </p>
          <div className="action-footer-buttons">
            <button className="secondary-btn" onClick={handleClose}>Acknowledge Alert</button>
            <button className="primary-btn-brand" onClick={() => {
              alert(`Alert dispatched to MTC Traffic Controller for: ${selectedAlert.location}`);
              handleClose();
            }}>
              Dispatch Investigation Unit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
