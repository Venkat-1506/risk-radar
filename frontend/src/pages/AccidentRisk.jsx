import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { AlertTriangle, MapPin, Shield, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export default function AccidentRisk() {
  const { alerts, setSelectedAlert } = useCommandCenter();

  const accidentAlerts = alerts.filter(a => a.type === 'accident');

  const riskLocations = [
    { name: 'Guindy Junction', count: 8, buses: 5, risk: 'HIGH', trend: '+15%', peak: '6 PM - 9 PM' },
    { name: 'Anna Nagar Circle', count: 6, buses: 4, risk: 'HIGH', trend: '+5%', peak: '8 AM - 11 AM' },
    { name: 'T. Nagar Bus Terminus Corridor', count: 4, buses: 3, risk: 'MEDIUM', trend: '-2%', peak: '5 PM - 8 PM' },
    { name: 'Velachery Bypass Crossing', count: 3, buses: 2, risk: 'MEDIUM', trend: '0%', peak: '9 AM - 12 PM' },
    { name: 'Koyambedu Roundabout Inner', count: 5, buses: 4, risk: 'HIGH', trend: '+20%', peak: '6 PM - 9 PM' }
  ];

  const diurnalRisk = [
    { label: '06 AM - 09 AM', value: 45, tone: 'is-orange' },
    { label: '09 AM - 12 PM', value: 60, tone: 'is-orange' },
    { label: '12 PM - 03 PM', value: 30, tone: 'is-green' },
    { label: '06 PM - 09 PM', value: 92, tone: 'is-red', peak: true },
    { label: '09 PM - 12 AM', value: 50, tone: 'is-orange' }
  ];

  const verificationSteps = [
    { title: 'Raw Observation', desc: 'A single bus camera flags a potential hazard at 40-60% confidence.' },
    { title: 'Verified Event', desc: 'A second independent transit unit reports the same hazard within 15 minutes (70-85% confidence).' },
    { title: 'Derived Intelligence', desc: '3+ vehicles corroborate the hazard. The system generates an official dispatcher warning.' }
  ];

  const highRiskCount = riskLocations.filter(loc => loc.risk === 'HIGH').length;
  const totalObservations = riskLocations.reduce((sum, loc) => sum + loc.count, 0);

  const renderTrend = (trend) => {
    if (trend.startsWith('+')) {
      return (
        <span className="ar-trend ar-trend-up">
          <TrendingUp size={12} /> {trend}
        </span>
      );
    }
    if (trend.startsWith('-')) {
      return (
        <span className="ar-trend ar-trend-down">
          <TrendingDown size={12} /> {trend}
        </span>
      );
    }
    return <span className="ar-trend ar-trend-flat">{trend}</span>;
  };

  return (
    <div className="sub-page accident-risk-page">
      {/* URBAN EYE command header */}
      <div className="ar-hero">
        <div className="ar-hero-main">
          <span className="ar-logo-badge">
            <img src="/logo.png" alt="URBAN EYE logo" />
          </span>
          <div className="ar-hero-copy">
            <span className="ar-kicker">
              <AlertTriangle size={12} /> Civil Hazard Monitor · Urban Eye
            </span>
            <h2 className="ar-title">Accident Risk &amp; Near-Miss Intelligence</h2>
            <p className="ar-subtitle">
              Repeated mobile-camera observations transformed into structurally actionable road-safety intelligence.
            </p>
          </div>
        </div>

        <div className="ar-hero-side">
          <span className="ar-live-pill">
            <span className="ar-live-dot" /> Live Observation Tracking
          </span>
          <div className="ar-hero-stats">
            <div className="ar-stat">
              <strong>{riskLocations.length}</strong>
              <span>Hotspots</span>
            </div>
            <div className="ar-stat">
              <strong>{highRiskCount}</strong>
              <span>High risk</span>
            </div>
            <div className="ar-stat">
              <strong>{totalObservations}</strong>
              <span>Observations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ar-layout">
        {/* Left column */}
        <div className="ar-col">
          <div className="ar-card">
            <div className="ar-card-head">
              <div>
                <span className="ar-card-kicker">Spatial Intelligence</span>
                <h3 className="ar-card-title">High-Risk Spatial Clusters</h3>
                <p className="ar-card-sub">AI-correlated hotspots requiring structural review</p>
              </div>
              <span className="ar-pill ar-pill-red">{riskLocations.length} zones</span>
            </div>

            <div className="ar-table-wrap">
              <table className="ar-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Incident Repeats</th>
                    <th>Unique Bus Telemetries</th>
                    <th>Peak Hours</th>
                    <th>Risk Level</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {riskLocations.map((loc) => (
                    <tr key={loc.name}>
                      <td>
                        <div className="ar-loc-cell">
                          <span className="ar-loc-pin"><MapPin size={13} /></span>
                          {loc.name}
                        </div>
                      </td>
                      <td>
                        <span className="ar-num-strong">{loc.count}</span>
                        <span className="ar-muted"> observations</span>
                      </td>
                      <td>
                        <span className="ar-num-strong">{loc.buses}</span>
                        <span className="ar-muted"> buses</span>
                      </td>
                      <td className="ar-muted">{loc.peak}</td>
                      <td>
                        <span className={`ar-risk ${loc.risk === 'HIGH' ? 'ar-risk-high' : 'ar-risk-medium'}`}>
                          {loc.risk}
                        </span>
                      </td>
                      <td>{renderTrend(loc.trend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ar-card">
            <div className="ar-card-head">
              <div>
                <span className="ar-card-kicker">Live Evidence</span>
                <h3 className="ar-card-title">Active Observational Alerts</h3>
                <p className="ar-card-sub">Corroborated camera events awaiting dispatcher review</p>
              </div>
              <span className="ar-pill ar-pill-red">{accidentAlerts.length} active</span>
            </div>

            <div className="ar-alert-list">
              {accidentAlerts.length === 0 ? (
                <div className="ar-empty">
                  No active accident alerts. Run the AI demo to ingest new observations.
                </div>
              ) : (
                accidentAlerts.map(alert => (
                  <div key={alert.id} className="ar-alert-item">
                    <div className="ar-alert-top">
                      <span className="ar-alert-loc">
                        <span className="ar-alert-pin"><MapPin size={13} /></span>
                        {alert.location}
                      </span>
                      <span className="ar-severity ar-severity-red">{alert.status}</span>
                    </div>

                    <p className="ar-alert-desc">{alert.details}</p>

                    <div className="ar-alert-meta">
                      <span><strong>{alert.confidence}%</strong> confidence</span>
                      <span><strong>{alert.busesObserved}</strong> buses</span>
                      <span>{alert.time}</span>
                    </div>

                    <button
                      className="ar-inspect-btn"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      Inspect verification evidence <ArrowRight size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="ar-col">
          <div className="ar-card ar-card-dark">
            <div className="ar-card-head">
              <div>
                <span className="ar-card-kicker ar-kicker-purple">Trust Layer</span>
                <h3 className="ar-card-title ar-title-light">Multi-Bus Verification Standard</h3>
                <p className="ar-card-sub ar-sub-light">False-positive suppression across independent transit units</p>
              </div>
              <span className="ar-shield-badge"><Shield size={18} /></span>
            </div>

            <div className="ar-pipeline">
              {verificationSteps.map((step, idx) => (
                <div key={step.title} className="ar-pipeline-step">
                  <span className="ar-pipeline-num">0{idx + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ar-card">
            <div className="ar-card-head">
              <div>
                <span className="ar-card-kicker">Time Intelligence</span>
                <h3 className="ar-card-title">Diurnal Risk Distribution</h3>
                <p className="ar-card-sub">Incident frequency mapped against MTC shift schedules</p>
              </div>
              <span className="ar-pill ar-pill-orange">Peak 06-09 PM</span>
            </div>

            <div className="ar-bars">
              {diurnalRisk.map((row) => (
                <div key={row.label} className={`ar-bar-row ${row.peak ? 'is-peak' : ''}`}>
                  <span className="ar-bar-label">{row.label}</span>
                  <div className="ar-bar-track">
                    <div className={`ar-bar-fill ${row.tone}`} style={{ width: `${row.value}%` }} />
                  </div>
                  <span className="ar-bar-value">{row.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ar-card">
            <div className="ar-card-head">
              <div>
                <span className="ar-card-kicker">Historical Signal</span>
                <h3 className="ar-card-title">30-Day Historical Trend</h3>
                <p className="ar-card-sub">Aggregate risk scores mapped across Chennai MTC routes</p>
              </div>
              <span className="ar-pill ar-pill-red"><TrendingUp size={12} /> +18%</span>
            </div>

            <div className="ar-trend-chart">
              <svg viewBox="0 0 200 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="arTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="20" x2="200" y2="20" stroke="#f1f5f9" strokeWidth="0.6" strokeDasharray="3" />
                <line x1="0" y1="40" x2="200" y2="40" stroke="#f1f5f9" strokeWidth="0.6" strokeDasharray="3" />
                <line x1="0" y1="60" x2="200" y2="60" stroke="#f1f5f9" strokeWidth="0.6" strokeDasharray="3" />
                <path
                  d="M0,70 L30,65 L60,55 L90,45 L120,48 L150,25 L180,30 L200,10 L200,80 L0,80 Z"
                  fill="url(#arTrendFill)"
                />
                <path
                  d="M0,70 L30,65 L60,55 L90,45 L120,48 L150,25 L180,30 L200,10"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="200" cy="10" r="3.5" fill="#ef4444" />
              </svg>
              <div className="ar-trend-labels">
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
