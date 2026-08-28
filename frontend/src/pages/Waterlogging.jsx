import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { Droplet, AlertCircle, ArrowRight, Eye, Calendar, TrendingUp } from 'lucide-react';

export default function Waterlogging() {
  const { alerts, setSelectedAlert } = useCommandCenter();

  // Filter out waterlogging-related alerts
  const waterloggingAlerts = alerts.filter(a => a.type === 'waterlogging');

  const waterloggedLocations = [
    { name: 'Tambaram Main Road (Bypass)', detections: 14, buses: 8, speedRed: '-42%', delay: '+11m', persistence: '4 hours', severity: 'HIGH' },
    { name: 'Velachery Junction Near Lake', detections: 9, buses: 6, speedRed: '-30%', delay: '+8m', persistence: '2 hours', severity: 'HIGH' },
    { name: 'Chromepet Subway Segment', detections: 12, buses: 7, speedRed: '-55%', delay: '+15m', persistence: '5 hours', severity: 'HIGH' },
    { name: 'Koyambedu Bus Terminal Entry', detections: 5, buses: 4, speedRed: '-25%', delay: '+5m', persistence: '1 hour', severity: 'MEDIUM' }
  ];

  return (
    <div className="sub-page waterlogging-page">
      <div className="sub-page-header border-blue-bottom">
        <div>
          <span className="sub-page-tag text-blue">HYDROLOGICAL HAZARD RADAR</span>
          <h2 className="sub-page-title">Road Waterlogging & Hydrology Intelligence</h2>
        </div>
        <div className="sub-page-meta">
          <span className="meta-badge bg-blue-light text-blue">
            <Droplet size={14} className="mr-1" /> Dynamic Water Level Mapping Active
          </span>
        </div>
      </div>

      <div className="sub-page-layout-grid">
        {/* Left: Table details & active alerts */}
        <div className="layout-left-col-7">
          <div className="card">
            <h3 className="card-title text-blue mb-2">Monitored Inundation Hotspots</h3>
            <span className="card-subtitle mb-3">AI detections matching puddle dimensions and speed telemetry drops</span>

            <table className="official-table">
              <thead>
                <tr>
                  <th>LOCATION</th>
                  <th>DETECTIONS</th>
                  <th>BUSES AFFECTED</th>
                  <th>SPEED DROP</th>
                  <th>DELAY EFFECT</th>
                  <th>PERSISTENCE</th>
                  <th>SEVERITY</th>
                </tr>
              </thead>
              <tbody>
                {waterloggedLocations.map((loc) => (
                  <tr key={loc.name}>
                    <td className="font-semibold text-blue">{loc.name}</td>
                    <td>{loc.detections} scans</td>
                    <td>{loc.buses} units</td>
                    <td className="text-red font-semibold">{loc.speedRed}</td>
                    <td>{loc.delay}</td>
                    <td>{loc.persistence}</td>
                    <td>
                      <span className={`badge-severity ${loc.severity === 'HIGH' ? 'badge-blue' : 'badge-orange'}`}>
                        {loc.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card mt-4">
            <h3 className="card-title text-blue mb-3">Active Inundation Notifications</h3>
            <div className="alerts-sub-grid">
              {waterloggingAlerts.map(alert => (
                <div key={alert.id} className="sub-grid-alert-item border-blue-left">
                  <div className="sg-header">
                    <span className="sg-location">{alert.location}</span>
                    <span className="sg-status-badge badge-blue">{alert.status}</span>
                  </div>
                  <p className="sg-desc">{alert.details}</p>
                  
                  <div className="sg-stats-row">
                    <span><strong>Confidence:</strong> {alert.confidence}% (HIGH)</span>
                    <span><strong>Detections:</strong> {alert.busesObserved} buses</span>
                  </div>

                  <div className="sg-action-row">
                    <span className="sg-time">{alert.time}</span>
                    <button 
                      className="sg-btn bg-blue-light text-blue"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      View Hydrology Evidence
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Graphic & Historical Trend */}
        <div className="layout-right-col-5">
          {/* Water Depth visual */}
          <div className="card">
            <h3 className="card-title text-blue mb-2">Tambaram East Bypass Pool Sensor</h3>
            <span className="card-subtitle mb-3">Telemetry cross-correlated with Route 21G cameras</span>

            <div className="pool-level-display mt-3">
              <div className="pool-visual-chassis">
                <div className="pool-water-fill-level animate-slosh">
                  <div className="slosh-wave"></div>
                  <span className="pool-height-text">Depth: ~18 cm</span>
                </div>
                {/* Reference markers */}
                <div className="pool-marker marker-30"><span>30cm - CRITICAL</span></div>
                <div className="pool-marker marker-15"><span>15cm - SUBSTANTIAL</span></div>
                <div className="pool-marker marker-5"><span>5cm - TRIVIAL</span></div>
              </div>
              
              <div className="pool-metadata mt-3 text-xs">
                <div className="flex-justify-between mb-1">
                  <span className="text-slate-500">Average Transit Speed:</span>
                  <span className="font-semibold">12 km/h (Normal: 32 km/h)</span>
                </div>
                <div className="flex-justify-between">
                  <span className="text-slate-500">Hydro Inundation Area:</span>
                  <span className="font-semibold">~120 sq meters estimated</span>
                </div>
              </div>
            </div>

            <div className="rec-box-blue mt-3">
              <strong>Urban Dispatch Verdict:</strong> High road water persistence detected. Automated alert dispatched to Chennai Drainage Maintenance Authority for drainage/road inspection.
            </div>
          </div>

          {/* Historical Trend */}
          <div className="card mt-4">
            <h3 className="card-title mb-1">14-Day Inundation Trend</h3>
            <span className="card-subtitle mb-3">Accumulated waterlogging occurrences (Chennai South Zone)</span>

            <div className="trend-large-graph mt-3">
              <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="none">
                <path d="M0,75 Q20,70 40,55 T80,50 T120,72 T160,20 T200,15" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
                <path d="M0,75 Q20,70 40,55 T80,50 T120,72 T160,20 T200,15 L200,80 L0,80 Z" fill="rgba(14, 165, 233, 0.08)" />
                {/* Grid reference lines */}
                <line x1="0" y1="20" x2="200" y2="20" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="0" y1="40" x2="200" y2="40" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="0" y1="60" x2="200" y2="60" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="3" />
              </svg>
              <div className="graph-x-labels text-xxs flex-justify-between mt-1 text-slate-400">
                <span>Aug 15</span>
                <span>Aug 22</span>
                <span>Aug 28 (Current)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
