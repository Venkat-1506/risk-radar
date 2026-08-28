import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { AlertCircle, Clock, Droplet, Users, ShieldAlert } from 'lucide-react';

export default function PriorityAlerts() {
  const { alerts, setSelectedAlert } = useCommandCenter();

  const getAlertIcon = (type) => {
    switch (type) {
      case 'accident': return <ShieldAlert className="alert-type-icon text-red" size={16} />;
      case 'waterlogging': return <Droplet className="alert-type-icon text-blue" size={16} />;
      case 'delay': return <Clock className="alert-type-icon text-orange" size={16} />;
      case 'safety': return <Users className="alert-type-icon text-purple" size={16} />;
      default: return <AlertCircle className="alert-type-icon" size={16} />;
    }
  };

  const getSeverityBadge = (severity, type) => {
    let colorClass = 'badge-purple';
    if (type === 'accident') colorClass = 'badge-red';
    else if (type === 'waterlogging') colorClass = 'badge-blue';
    else if (type === 'delay') colorClass = 'badge-orange';

    return <span className={`badge-severity ${colorClass}`}>{severity}</span>;
  };

  return (
    <div className="card alerts-panel-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Priority Action Alerts</h3>
          <span className="card-subtitle">Real-time Command Center Dispatch Queue</span>
        </div>
        <span className="badge-count-red">{alerts.length} Queue</span>
      </div>

      <div className="alerts-list">
        {alerts.map((alert) => {
          const type = alert.incident_type || alert.type || 'unknown';
          const observed = alert.buses_observed || alert.busesObserved || 1;
          const buses = alert.buses_list 
            ? (typeof alert.buses_list === 'string' ? alert.buses_list.split(',').length : alert.buses_list.length)
            : (alert.busesList ? alert.busesList.length : 1);

          return (
            <div key={alert.id} className={`alert-list-item severity-${alert.severity.toLowerCase()}`}>
              <div className="alert-item-top">
                <div className="alert-title-group">
                  {getAlertIcon(type)}
                  <span className="alert-item-title">{alert.title}</span>
                </div>
                {getSeverityBadge(alert.severity, type)}
              </div>

              <div className="alert-item-body">
                <h4 className="alert-item-location">{alert.location}</h4>
                <p className="alert-item-stats">
                  {type === 'accident' && `${observed} observations · ${buses} distinct buses`}
                  {type === 'waterlogging' && `${observed} detections · ${buses} buses affected`}
                  {type === 'delay' && `Average Delay: ${alert.impact}`}
                  {type === 'safety' && `${alert.impact}`}
                </p>
              </div>

              <div className="alert-item-actions">
                <span className="alert-timestamp">{alert.time}</span>
                <button 
                  onClick={() => setSelectedAlert(alert)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
