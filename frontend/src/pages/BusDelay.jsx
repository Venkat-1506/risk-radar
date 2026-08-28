import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { Clock, AlertCircle, ArrowRight, BarChart3, TrendingUp, HelpCircle } from 'lucide-react';

export default function BusDelay() {
  const { alerts, setSelectedAlert } = useCommandCenter();

  // Filter out delay-related alerts
  const delayAlerts = alerts.filter(a => a.type === 'delay');

  const delayedCorridors = [
    { route: '21G', segment: 'Tambaram - Guindy Outer', expected: '42 min', actual: '59 min', delay: '+17 min', status: 'SEVERE', cause: 'Traffic + Waterlogging' },
    { route: '570', segment: 'Velachery Bypass Road', expected: '35 min', actual: '44 min', delay: '+9 min', status: 'MODERATE', cause: 'Traffic Congestion' },
    { route: '91', segment: 'Koyambedu Roundabout Loop', expected: '50 min', actual: '72 min', delay: '+22 min', status: 'CRITICAL', cause: 'Metro Road Blocks' },
    { route: '102', segment: 'Adyar Gate Road segment', expected: '28 min', actual: '34 min', delay: '+6 min', status: 'LIGHT', cause: 'Traffic Congestion' }
  ];

  return (
    <div className="sub-page bus-delay-page">
      <div className="sub-page-header border-orange-bottom">
        <div>
          <span className="sub-page-tag text-orange">TRANSIT SCHEDULE TELEMETRY</span>
          <h2 className="sub-page-title">Bus Delay Analytics & Cause Correlation</h2>
        </div>
        <div className="sub-page-meta">
          <span className="meta-badge bg-orange-light text-orange">
            <Clock size={14} className="mr-1" /> Dynamic Routing Telemetry Active
          </span>
        </div>
      </div>

      <div className="sub-page-layout-grid">
        {/* Left: Corridors & Active alerts */}
        <div className="layout-left-col-7">
          <div className="card">
            <h3 className="card-title text-orange mb-2">Transit Corridor Travel Spikes</h3>
            <span className="card-subtitle mb-3">Telemetry deviation from historical scheduled durations</span>

            <table className="official-table">
              <thead>
                <tr>
                  <th>ROUTE ID</th>
                  <th>SEGMENT</th>
                  <th>EXPECTED</th>
                  <th>ACTUAL</th>
                  <th>DELAY SPARK</th>
                  <th>CORRELATED CAUSE</th>
                </tr>
              </thead>
              <tbody>
                {delayedCorridors.map((corr) => (
                  <tr key={corr.route}>
                    <td className="font-semibold text-orange">Route {corr.route}</td>
                    <td>{corr.segment}</td>
                    <td>{corr.expected}</td>
                    <td>{corr.actual}</td>
                    <td>
                      <span className={`badge-severity ${corr.status === 'CRITICAL' ? 'badge-red' : corr.status === 'SEVERE' ? 'badge-orange' : 'badge-purple'}`}>
                        {corr.delay}
                      </span>
                    </td>
                    <td>
                      <span className="text-xxs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        {corr.cause}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card mt-4">
            <h3 className="card-title text-orange mb-3">Active Delay Telemetries</h3>
            <div className="alerts-sub-grid">
              {delayAlerts.map(alert => (
                <div key={alert.id} className="sub-grid-alert-item border-orange-left">
                  <div className="sg-header">
                    <span className="sg-location">{alert.location}</span>
                    <span className="sg-status-badge badge-orange">{alert.status}</span>
                  </div>
                  <p className="sg-desc">{alert.details}</p>
                  
                  <div className="sg-stats-row">
                    <span><strong>Confidence:</strong> {alert.confidence}% (HIGH)</span>
                    <span><strong>Observed by:</strong> {alert.busesObserved} buses</span>
                  </div>

                  <div className="sg-action-row">
                    <span className="sg-time">{alert.time}</span>
                    <button 
                      className="sg-btn bg-orange-light text-orange"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      Analyze Bottleneck Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Cause probability & Weekly Trend */}
        <div className="layout-right-col-5">
          {/* Cause Probability card */}
          <div className="card">
            <div className="flex-align-center mb-1">
              <BarChart3 size={18} className="color-orange mr-1" />
              <h3 className="card-title">AI Delay Attribution Analysis</h3>
            </div>
            <span className="card-subtitle mb-3">Correlated likelihood causes based on visual & telemetry logs</span>

            <div className="cause-progress-row mt-3">
              <div className="cause-header text-sm">
                <span>Traffic Congestion Density</span>
                <strong>55%</strong>
              </div>
              <div className="cause-progress-bar">
                <div className="cause-fill bg-orange" style={{ width: '55%' }}></div>
              </div>
            </div>

            <div className="cause-progress-row">
              <div className="cause-header text-sm">
                <span>Hydrological Obstructions (Waterlogging)</span>
                <strong>25%</strong>
              </div>
              <div className="cause-progress-bar">
                <div className="cause-fill bg-blue" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="cause-progress-row">
              <div className="cause-header text-sm">
                <span>Adaptive Traffic Signal Phase Delays</span>
                <strong>15%</strong>
              </div>
              <div className="cause-progress-bar">
                <div className="cause-fill bg-purple" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div className="cause-progress-row">
              <div className="cause-header text-sm">
                <span>Bus Mechanical/Stop Dwell Times</span>
                <strong>5%</strong>
              </div>
              <div className="cause-progress-bar">
                <div className="cause-fill bg-slate-400" style={{ width: '5%' }}></div>
              </div>
            </div>

            <div className="disclaimer-callout-grey mt-4">
              <HelpCircle size={14} className="color-slate mr-1 shrink-0" />
              <p className="text-xxs text-slate-500">
                <strong>Analysis Note:</strong> Cause attributions represent derived statistical likelihoods correlating speed reductions, water segments, and traffic densities, and are not confirmed mechanical failure causes.
              </p>
            </div>
          </div>

          {/* Historical delay hotspot weekly */}
          <div className="card mt-4">
            <h3 className="card-title mb-1">Weekly Delay Index - T. Nagar Junction</h3>
            <span className="card-subtitle mb-3">High travel-time spikes recurring at central loop</span>

            <div className="weekly-bars-container-large mt-3">
              {[
                { day: 'Mon', value: '70%', delay: '+15m' },
                { day: 'Tue', value: '80%', delay: '+18m' },
                { day: 'Wed', value: '75%', delay: '+17m' },
                { day: 'Thu', value: '95%', delay: '+20m' },
                { day: 'Fri', value: '82%', delay: '+16m' }
              ].map((d) => (
                <div key={d.day} className="weekly-bar-large-col">
                  <span className="w-large-delay">{d.delay}</span>
                  <div className="w-large-fill-bg">
                    <div 
                      className="w-large-fill-fill" 
                      style={{ 
                        height: d.value, 
                        backgroundColor: d.value === '95%' ? '#ef4444' : '#f97316' 
                      }}
                    ></div>
                  </div>
                  <span className="w-large-day">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
