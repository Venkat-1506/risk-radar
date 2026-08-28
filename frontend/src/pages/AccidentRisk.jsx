import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { AlertTriangle, MapPin, Eye, CheckCircle2, TrendingUp, Calendar, Clock, Shield } from 'lucide-react';

export default function AccidentRisk() {
  const { alerts, setSelectedAlert } = useCommandCenter();

  // Filter out accident-related alerts
  const accidentAlerts = alerts.filter(a => a.type === 'accident');

  const riskLocations = [
    { name: 'Guindy Junction', count: 8, buses: 5, risk: 'HIGH', trend: '+15%', peak: '6 PM - 9 PM' },
    { name: 'Anna Nagar Circle', count: 6, buses: 4, risk: 'HIGH', trend: '+5%', peak: '8 AM - 11 AM' },
    { name: 'T. Nagar Bus Terminus Corridor', count: 4, buses: 3, risk: 'MEDIUM', trend: '-2%', peak: '5 PM - 8 PM' },
    { name: 'Velachery Bypass Crossing', count: 3, buses: 2, risk: 'MEDIUM', trend: '0%', peak: '9 AM - 12 PM' },
    { name: 'Koyambedu Roundabout Inner', count: 5, buses: 4, risk: 'HIGH', trend: '+20%', peak: '6 PM - 9 PM' }
  ];

  return (
    <div className="sub-page accident-risk-page">
      <div className="sub-page-header border-red-bottom">
        <div>
          <span className="sub-page-tag text-red">CIVIL HAZARD MONITOR</span>
          <h2 className="sub-page-title">Accident Risk & Near-Miss Intelligence</h2>
        </div>
        <div className="sub-page-meta">
          <span className="meta-badge bg-red-light text-red">
            <AlertTriangle size={14} className="mr-1" /> Repeated Observations Tracking
          </span>
        </div>
      </div>

      <div className="sub-page-layout-grid">
        {/* Left: Locations & Live observations */}
        <div className="layout-left-col-7">
          {/* Risk Clustering Table */}
          <div className="card">
            <div className="card-header-row mb-3">
              <div>
                <h3 className="card-title text-red">High-Risk Spatial Clusters</h3>
                <span className="card-subtitle">AI-correlated hotspots requiring structural review</span>
              </div>
            </div>

            <table className="official-table">
              <thead>
                <tr>
                  <th>LOCATION</th>
                  <th>INCIDENT REPEATS</th>
                  <th>UNIQUE BUS TELEMETRIES</th>
                  <th>PEAK HOURS</th>
                  <th>RISK LEVEL</th>
                  <th>TREND</th>
                </tr>
              </thead>
              <tbody>
                {riskLocations.map((loc) => (
                  <tr key={loc.name}>
                    <td>
                      <div className="flex-align-center font-semibold">
                        <MapPin size={14} className="color-red mr-1" />
                        {loc.name}
                      </div>
                    </td>
                    <td>{loc.count} observations</td>
                    <td>{loc.buses} buses</td>
                    <td>{loc.peak}</td>
                    <td>
                      <span className={`badge-severity ${loc.risk === 'HIGH' ? 'badge-red' : 'badge-orange'}`}>
                        {loc.risk}
                      </span>
                    </td>
                    <td className={loc.trend.startsWith('+') ? 'text-red' : 'text-green'}>
                      {loc.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Accident Risk Alerts */}
          <div className="card mt-4">
            <h3 className="card-title text-red mb-3">Active Observational Alerts</h3>
            <div className="alerts-sub-grid">
              {accidentAlerts.map(alert => (
                <div key={alert.id} className="sub-grid-alert-item border-red-left">
                  <div className="sg-header">
                    <span className="sg-location">{alert.location}</span>
                    <span className="sg-status-badge badge-red">{alert.status}</span>
                  </div>
                  <p className="sg-desc">{alert.details}</p>
                  
                  <div className="sg-stats-row">
                    <span><strong>Confidence:</strong> {alert.confidence}%</span>
                    <span><strong>Buses:</strong> {alert.busesObserved} ({alert.busesList.join(', ')})</span>
                  </div>

                  <div className="sg-action-row">
                    <span className="sg-time">{alert.time}</span>
                    <button 
                      className="sg-btn bg-red-light text-red"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      Inspect Verification Evidence
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Trend Graphs & Analytics */}
        <div className="layout-right-col-5">
          {/* Verification Pipeline Rule Card */}
          <div className="card bg-dark-navy text-white">
            <div className="flex-align-center mb-2 text-red">
              <Shield size={18} className="mr-1" />
              <h4 className="card-title text-white font-semibold">Multi-Bus Verification Standard</h4>
            </div>
            <p className="desc-text-white text-xs mb-3">
              To avoid false positives from single vehicle camera calibration errors, the central command center implements an automated multi-bus safety correlation pipeline:
            </p>
            <div className="visual-pipeline-steps text-xs">
              <div className="vp-step"><span className="vp-bullet">1</span> <strong>Raw Observation:</strong> Single bus camera flags a potential hazard (40-60% confidence).</div>
              <div className="vp-step"><span className="vp-bullet">2</span> <strong>Verified Event:</strong> A second independent transit unit reports within 15 minutes (70-85% confidence).</div>
              <div className="vp-step"><span className="vp-bullet">3</span> <strong>Derived Intelligence:</strong> 3+ vehicles verify the hazard. The system generates an official dispatcher warning.</div>
            </div>
          </div>

          {/* Time Distribution */}
          <div className="card mt-4">
            <h3 className="card-title mb-2">Diurnal Risk Distribution</h3>
            <span className="card-subtitle">Incident frequency mapped against MTC shift schedules</span>
            
            <div className="chart-bar-y-grid mt-3">
              <div className="bar-y-row">
                <span className="bar-y-label">06 AM - 09 AM</span>
                <div className="bar-y-fill-container">
                  <div className="bar-y-fill bg-orange" style={{ width: '45%' }}></div>
                </div>
                <span className="bar-y-val">45%</span>
              </div>

              <div className="bar-y-row">
                <span className="bar-y-label">09 AM - 12 PM</span>
                <div className="bar-y-fill-container">
                  <div className="bar-y-fill bg-orange" style={{ width: '60%' }}></div>
                </div>
                <span className="bar-y-val">60%</span>
              </div>

              <div className="bar-y-row">
                <span className="bar-y-label">12 PM - 03 PM</span>
                <div className="bar-y-fill-container">
                  <div className="bar-y-fill bg-green" style={{ width: '30%' }}></div>
                </div>
                <span className="bar-y-val">30%</span>
              </div>

              <div className="bar-y-row font-semibold">
                <span className="bar-y-label text-red">06 PM - 09 PM (Peak)</span>
                <div className="bar-y-fill-container">
                  <div className="bar-y-fill bg-red" style={{ width: '92%' }}></div>
                </div>
                <span className="bar-y-val text-red">92%</span>
              </div>

              <div className="bar-y-row">
                <span className="bar-y-label">09 PM - 12 AM</span>
                <div className="bar-y-fill-container">
                  <div className="bar-y-fill bg-orange" style={{ width: '50%' }}></div>
                </div>
                <span className="bar-y-val">50%</span>
              </div>
            </div>
          </div>

          {/* 30-Day Trend */}
          <div className="card mt-4">
            <h3 className="card-title mb-1">30-Day Historical Trend</h3>
            <span className="card-subtitle">Aggregate risk scores mapped across Chennai MTC routes</span>

            <div className="trend-large-graph mt-3">
              <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="none">
                <path d="M0,70 L30,65 L60,55 L90,45 L120,48 L150,25 L180,30 L200,10" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                <path d="M0,70 L30,65 L60,55 L90,45 L120,48 L150,25 L180,30 L200,10 L200,80 L0,80 Z" fill="rgba(239, 68, 68, 0.08)" />
                {/* Horizontal reference lines */}
                <line x1="0" y1="20" x2="200" y2="20" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="0" y1="40" x2="200" y2="40" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="0" y1="60" x2="200" y2="60" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="3" />
              </svg>
              <div className="graph-x-labels text-xxs flex-justify-between mt-1 text-slate-400">
                <span>Aug 01</span>
                <span>Aug 15</span>
                <span>Aug 28 (Current)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
