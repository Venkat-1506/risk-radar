import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { Users, Info, ShieldCheck, BarChart3, AlertCircle, Camera, Check } from 'lucide-react';

export default function BusSafety() {
  const { alerts, setSelectedAlert } = useCommandCenter();

  // Filter out safety-related alerts
  const safetyAlerts = alerts.filter(a => a.type === 'safety');

  const overcrowdedRoutes = [
    { route: '21G', segment: 'Guindy - Tambaram Corridor', currentOccupancy: '138%', status: 'OVERCROWDED', dispatchStatus: 'Secondary Bus Dispatched', peakTime: '8:30 AM - 10:00 AM' },
    { route: '570', segment: 'Velachery - OMR Expressway', currentOccupancy: '115%', status: 'STEADY-HIGH', dispatchStatus: 'Normal Corridor Service', peakTime: '9:00 AM - 10:30 AM' },
    { route: '91', segment: 'Chromepet - Koyambedu Loop', currentOccupancy: '128%', status: 'OVERCROWDED', dispatchStatus: 'Standby Route Triggered', peakTime: '5:30 PM - 7:30 PM' },
    { route: '19', segment: 'Adyar - T. Nagar Corridor', currentOccupancy: '98%', status: 'NORMAL', dispatchStatus: 'Normal Corridor Service', peakTime: '6:00 PM - 7:30 PM' }
  ];

  return (
    <div className="sub-page bus-safety-page">
      <div className="sub-page-header border-purple-bottom">
        <div>
          <span className="sub-page-tag text-purple">PASSENGER SAFETY COMPLIANCE</span>
          <h2 className="sub-page-title">Passenger Occupancy & Inside Analytics</h2>
        </div>
        <div className="sub-page-meta">
          <span className="meta-badge bg-purple-light text-purple">
            <ShieldCheck size={14} className="mr-1" /> Anonymized Density Engine Active
          </span>
        </div>
      </div>

      {/* Compliance Disclaimer Banner */}
      <div className="privacy-compliance-banner">
        <Info size={16} className="color-purple mr-2 shrink-0" />
        <p className="privacy-text text-xs">
          <strong>Privacy Compliance Notice:</strong> Passenger occupancy coefficients are calculated strictly via anonymized spatial flow models and edge density grids. Individual face recognition features are permanently disabled.
        </p>
      </div>

      <div className="sub-page-layout-grid mt-4">
        {/* Left Col: Live Inside Feed & Occupancy Graph */}
        <div className="layout-left-col-6">
          <div className="card">
            <h3 className="card-title text-purple mb-2">Live Bus Chassis View (Mock Node)</h3>
            <span className="card-subtitle mb-3">Occupancy analysis of Route 21G - Bus 101</span>

            <div className="inside-camera-visualizer">
              <div className="ic-header">
                <span className="ic-title">ROUTE 21G · BUS-101 (TAMBARAM)</span>
                <span className="occupancy-tag-red">138% OVERCROWDED</span>
              </div>
              
              <div className="bus-chassis-graph">
                {/* SVG representing bus layout and passenger dots */}
                <svg viewBox="0 0 300 110" className="bus-vector-layout">
                  {/* Bus Outline */}
                  <rect x="5" y="10" width="290" height="90" rx="10" fill="#1e1e38" stroke="#4a4a6b" strokeWidth="2" />
                  <rect x="10" y="25" width="280" height="60" rx="5" fill="#0f0f1b" />
                  
                  {/* Windows / Seats Layout */}
                  {[...Array(9)].map((_, i) => (
                    <g key={i} transform={`translate(${20 + i * 28}, 0)`}>
                      <rect x="0" y="15" width="22" height="15" rx="3" fill="#38bdf8" fillOpacity="0.2" />
                      <rect x="0" y="80" width="22" height="15" rx="3" fill="#38bdf8" fillOpacity="0.2" />
                    </g>
                  ))}

                  {/* Dense Passenger Heatmap Circles (anonymized density) */}
                  <g fill="#a855f7" fillOpacity="0.7">
                    {/* Front Door cluster */}
                    <circle cx="35" cy="55" r="4" fill="#ef4444" />
                    <circle cx="43" cy="48" r="4" fill="#ef4444" />
                    <circle cx="32" cy="42" r="4" fill="#ef4444" />
                    <circle cx="47" cy="58" r="4" fill="#ef4444" />

                    {/* Middle Passage Cluster */}
                    <circle cx="85" cy="55" r="4" />
                    <circle cx="95" cy="50" r="4" />
                    <circle cx="105" cy="53" r="4" />
                    <circle cx="115" cy="48" r="4" />
                    <circle cx="125" cy="56" r="4" />
                    <circle cx="135" cy="51" r="4" fill="#ef4444" />
                    <circle cx="145" cy="54" r="4" fill="#ef4444" />
                    <circle cx="155" cy="49" r="4" fill="#ef4444" />

                    {/* Rear Door Cluster */}
                    <circle cx="215" cy="55" r="4" fill="#ef4444" />
                    <circle cx="225" cy="47" r="4" fill="#ef4444" />
                    <circle cx="235" cy="54" r="4" fill="#ef4444" />
                    <circle cx="245" cy="50" r="4" />
                    <circle cx="255" cy="56" r="4" />
                  </g>

                  {/* Drivers Cabin */}
                  <line x1="265" y1="25" x2="265" y2="85" stroke="#4a4a6b" strokeWidth="1.5" strokeDasharray="3" />
                  <circle cx="278" cy="55" r="6" fill="#475569" />
                  <text x="278" y="58" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">D</text>
                </svg>
              </div>

              <div className="ic-details">
                <div className="ic-meta-row">
                  <span><strong>Peak Occupancy:</strong> 142%</span>
                  <span><strong>Average Occupancy:</strong> 118%</span>
                </div>
                <div className="ic-meta-row">
                  <span><strong>Capacity Rating:</strong> 85 seated + standees</span>
                  <span className="text-red font-semibold">Active Alerts: 12 Overcrowding</span>
                </div>
              </div>
            </div>

            <div className="rec-box-purple mt-3">
              <strong>Urban Recommendation:</strong> Persistent peak-hour overcrowding detected on Guindy corridor. Recommend dispatching secondary scheduling support.
            </div>
          </div>
        </div>

        {/* Right Col: Overcrowded route tables & metrics */}
        <div className="layout-right-col-6">
          <div className="card">
            <h3 className="card-title text-purple mb-2">Transit Capacity Performance</h3>
            <span className="card-subtitle">Current status of monitored Chennai route corridors</span>

            <div className="capacity-corridors-list mt-3">
              {overcrowdedRoutes.map((routeData) => (
                <div key={routeData.route} className="capacity-corridor-item">
                  <div className="cc-header">
                    <span className="cc-route">Route {routeData.route}</span>
                    <span className={`cc-tag ${routeData.status === 'OVERCROWDED' ? 'bg-red-light text-red' : 'bg-green-light text-green'}`}>
                      {routeData.status}
                    </span>
                  </div>
                  
                  <div className="cc-details">
                    <span className="cc-segment">{routeData.segment}</span>
                    <span className="cc-val">Density: <strong>{routeData.currentOccupancy}</strong></span>
                  </div>

                  <div className="cc-dispatch">
                    <span className="cc-dispatch-status">{routeData.dispatchStatus}</span>
                    <span className="cc-peak">Peak: {routeData.peakTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Alerts list */}
          <div className="card mt-4">
            <h3 className="card-title text-purple mb-3">Active Safety Notifications</h3>
            <div className="safety-notifications-list">
              {safetyAlerts.map(alert => (
                <div key={alert.id} className="safety-notif-item border-purple-left">
                  <div className="sn-top">
                    <span className="sn-title">{alert.title}</span>
                    <span className="sn-time">{alert.time}</span>
                  </div>
                  <p className="sn-desc">{alert.details}</p>
                  <div className="sn-action-row">
                    <span>Observed by: <strong>{alert.busesList.join(', ')}</strong></span>
                    <button 
                      className="sn-view-btn"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      Inspect Logs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
