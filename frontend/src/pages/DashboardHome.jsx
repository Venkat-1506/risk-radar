import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import LiveBusFeed from '../components/LiveBusFeed';
import CityMap from '../components/CityMap';
import MultiBusVerification from '../components/MultiBusVerification';
import CrossEventIntelligence from '../components/CrossEventIntelligence';
import PriorityAlerts from '../components/PriorityAlerts';
import HowItWorks from '../components/HowItWorks';
import AlertDetailModal from '../components/AlertDetailModal';
import { 
  AlertTriangle, 
  Clock, 
  Droplet, 
  TrendingUp, 
  Users, 
  TrendingDown, 
  Play, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

export default function DashboardHome() {
  const { 
    metrics, 
    runFullDemo, 
    resetSimulation, 
    simulationActive, 
    activeStage,
    simLogs,
    selectedScenarioKey,
    setSelectedScenarioKey,
    scenarios,
    setActivePage
  } = useCommandCenter();

  return (
    <div className="dashboard-page space-y-4">
      {/* Demo Scenario Control Bar */}
      <div className="card demo-toolbar bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="demo-toolbar-copy flex items-center gap-2">
          <span className="demo-signal-icon"><Sparkles size={18} /></span>
          <div>
            <span className="demo-kicker">PRELOADED CAMERA LAB / LIVE PIPELINE</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">LIVE AI INCIDENT DETECTION DEMO</h2>
            <p className="text-[11px] text-slate-400">Select a preloaded camera scenario and run the automated end-to-end detection pipeline.</p>
          </div>
        </div>

        <div className="demo-toolbar-actions flex flex-wrap items-center gap-2">
          <div className="demo-scenario-field relative">
            <label htmlFor="demo-scenario">SCENARIO</label>
            <select 
              id="demo-scenario"
              className="bg-slate-950 text-white text-xs px-3 py-2 rounded-lg border border-purple-900/60 font-semibold focus:outline-none focus:border-purple-500 cursor-pointer pr-8"
              value={selectedScenarioKey}
              onChange={(e) => setSelectedScenarioKey(e.target.value)}
              disabled={simulationActive}
            >
              {Object.values(scenarios).map(sc => (
                <option key={sc.id} value={sc.id}>{sc.title}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => runFullDemo(selectedScenarioKey)} 
            disabled={simulationActive}
            className={`btn-sim-start text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md ${
              simulationActive 
                ? 'bg-purple-950 text-purple-400 border border-purple-800 cursor-not-allowed opacity-75' 
                : 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400 shadow-purple-900/30'
            }`}
          >
            <Play size={14} fill="currentColor" />
            {simulationActive ? `EXECUTING STAGE 0${activeStage}/07...` : 'RUN AI DEMO'}
          </button>
          
          <button 
            onClick={resetSimulation} 
            disabled={simulationActive}
            className="btn-sim-reset text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-all"
          >
            <RotateCcw size={14} />
            Reset Demo
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="kpi-grid">
        {/* KPI 1 */}
        <div className="card kpi-card border-red" onClick={() => setActivePage('Accident Risk')}>
          <div className="kpi-icon-wrapper bg-red-light">
            <AlertTriangle className="kpi-icon text-red" size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">ACCIDENT RISK ZONES</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{metrics.accidentRiskZonesCount}</span>
              <span className="kpi-trend text-red">
                <TrendingUp size={14} /> +2 wk
              </span>
            </div>
            <span className="kpi-desc">High risk nodes verified</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="card kpi-card border-purple" onClick={() => setActivePage('Bus Safety')}>
          <div className="kpi-icon-wrapper bg-purple-light">
            <Users className="kpi-icon text-purple" size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">ACTIVE BUS SAFETY ALERTS</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{metrics.activeSafetyAlertsCount}</span>
              <span className="kpi-trend text-purple">
                <TrendingUp size={14} /> 3 routes
              </span>
            </div>
            <span className="kpi-desc">Overcrowding & safety issues</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="card kpi-card border-orange" onClick={() => setActivePage('Bus Delay')}>
          <div className="kpi-icon-wrapper bg-orange-light">
            <Clock className="kpi-icon text-orange" size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">RECURRING DELAY HOTSPOTS</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{metrics.recurringDelayHotspotsCount}</span>
              <span className="kpi-trend text-orange">
                <TrendingDown size={14} /> +14% delay
              </span>
            </div>
            <span className="kpi-desc">Average travel delays</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="card kpi-card border-blue" onClick={() => setActivePage('Waterlogging')}>
          <div className="kpi-icon-wrapper bg-blue-light">
            <Droplet className="kpi-icon text-blue" size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">PERSISTENT WATERLOGGING</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{metrics.persistentWaterloggingCount}</span>
              <span className="kpi-trend text-blue">
                <TrendingUp size={14} /> 4 active
              </span>
            </div>
            <span className="kpi-desc">Route blockages mapped</span>
          </div>
        </div>
      </div>

      {/* Main Core Layout: Live Feed & GIS Map */}
      <div className="two-column-layout">
        <LiveBusFeed />
        <CityMap />
      </div>

      {/* Simulation Logs Output (Visible when active) */}
      {simLogs.length > 0 && (
        <div className="card sim-logs-card">
          <h4 className="sim-logs-title">Simulation Event Ingestion Stream</h4>
          <div className="sim-logs-list">
            {simLogs.map((log, idx) => (
              <div key={idx} className="sim-log-item">
                <span className="log-time">[{log.time}]</span>
                <span className="log-bus">{log.bus}</span>
                <span className="log-text">{log.log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Second Row: Detailed Intelligence Cards */}
      <div className="four-card-intelligence-grid">
        {/* Card 1: Accident Risk Analysis */}
        <div className="card intel-card-detail">
          <div className="card-top border-red-top">
            <h3 className="intel-card-title">Accident Risk Analysis</h3>
            <span className="badge badge-red-outline">High Risk Areas</span>
          </div>
          
          <div className="intel-card-body">
            <div className="ranked-location-list">
              <div className="ranked-item">
                <span className="rank-num">01</span>
                <div className="rank-detail">
                  <h4 className="rank-loc">Guindy Junction</h4>
                  <span className="rank-stats">8 incidents · 5 buses</span>
                </div>
                <span className="rank-badge badge-red">HIGH</span>
              </div>

              <div className="ranked-item">
                <span className="rank-num">02</span>
                <div className="rank-detail">
                  <h4 className="rank-loc">Anna Nagar Circle</h4>
                  <span className="rank-stats">6 incidents · 4 buses</span>
                </div>
                <span className="rank-badge badge-red">HIGH</span>
              </div>

              <div className="ranked-item">
                <span className="rank-num">03</span>
                <div className="rank-detail">
                  <h4 className="rank-loc">T. Nagar Bus Terminus</h4>
                  <span className="rank-stats">4 incidents · 3 buses</span>
                </div>
                <span className="rank-badge badge-orange">MEDIUM</span>
              </div>
            </div>

            <div className="tiny-trend-graph">
              <span className="graph-label">Guindy Risk Coefficient:</span>
              <svg width="100%" height="30" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,25 Q15,20 30,10 T60,5 T90,28" fill="none" stroke="#ef4444" strokeWidth="2" />
                <path d="M0,25 Q15,20 30,10 T60,5 T90,28 L100,30 L0,30 Z" fill="rgba(239, 68, 68, 0.1)" />
              </svg>
            </div>
            
            <p className="intel-card-footer-note">
              Based on repeated visual node conflicts corroborating with telemetry drops.
            </p>
          </div>
          
          <button 
            className="intel-card-action-btn"
            onClick={() => setActivePage('Accident Risk')}
          >
            View Full Analysis &rarr;
          </button>
        </div>

        {/* Card 2: Bus Safety / Inside Camera */}
        <div className="card intel-card-detail">
          <div className="card-top border-purple-top">
            <h3 className="intel-card-title">Bus Safety / Occupancy</h3>
            <span className="badge badge-purple-outline">Interior Feeds</span>
          </div>

          <div className="intel-card-body">
            <div className="occupancy-stats-panel">
              <div className="occupancy-large-row">
                <div>
                  <span className="occupancy-lbl">Route 21G (Bus 101)</span>
                  <div className="occupancy-pct text-purple">138%</div>
                </div>
                <span className="occupancy-tag-red">OVERCROWDED</span>
              </div>

              <div className="occupancy-bars-grid">
                <div>
                  <span className="bar-lbl">Peak Occupancy</span>
                  <span className="bar-val">142%</span>
                </div>
                <div>
                  <span className="bar-lbl">Average Occupancy</span>
                  <span className="bar-val">118%</span>
                </div>
              </div>
            </div>

            <div className="interior-bus-image-placeholder">
              {/* SVG interior layout mock */}
              <svg viewBox="0 0 150 65" className="interior-svg" width="100%">
                <rect width="150" height="65" rx="6" fill="#1e1b4b" />
                {/* Windows */}
                <rect x="10" y="8" width="22" height="15" rx="3" fill="#38bdf8" fillOpacity="0.4" />
                <rect x="37" y="8" width="22" height="15" rx="3" fill="#38bdf8" fillOpacity="0.4" />
                <rect x="64" y="8" width="22" height="15" rx="3" fill="#38bdf8" fillOpacity="0.4" />
                <rect x="91" y="8" width="22" height="15" rx="3" fill="#38bdf8" fillOpacity="0.4" />
                <rect x="118" y="8" width="22" height="15" rx="3" fill="#38bdf8" fillOpacity="0.4" />
                {/* Passengers circles representing overcrowding dots */}
                <circle cx="21" cy="35" r="5" fill="#a855f7" />
                <circle cx="48" cy="35" r="5" fill="#a855f7" />
                <circle cx="75" cy="35" r="5" fill="#a855f7" />
                <circle cx="102" cy="35" r="5" fill="#a855f7" />
                <circle cx="129" cy="35" r="5" fill="#a855f7" />
                {/* Overcrowded center dots */}
                <circle cx="34" cy="45" r="4.5" fill="#ef4444" />
                <circle cx="60" cy="45" r="4.5" fill="#ef4444" />
                <circle cx="88" cy="45" r="4.5" fill="#ef4444" />
                <circle cx="114" cy="45" r="4.5" fill="#ef4444" />
                {/* Text overlay */}
                <text x="75" y="58" fill="#ffffff" fontSize="6.5" textAnchor="middle" fontFamily="sans-serif">
                  AI Detections: standing count exceeds +38% limit
                </text>
              </svg>
            </div>

            <div className="alert-counts-row">
              <div className="alert-count-box">
                <span className="ac-num">12</span>
                <span className="ac-lbl">Overcrowding</span>
              </div>
              <div className="alert-count-box">
                <span className="ac-num">3</span>
                <span className="ac-lbl">Safety Events</span>
              </div>
            </div>
          </div>

          <button 
            className="intel-card-action-btn"
            onClick={() => setActivePage('Bus Safety')}
          >
            View Bus Safety Reports &rarr;
          </button>
        </div>

        {/* Card 3: Bus Delay Intelligence */}
        <div className="card intel-card-detail">
          <div className="card-top border-orange-top">
            <h3 className="intel-card-title">Bus Delay Intelligence</h3>
            <span className="badge badge-orange-outline">Correlations</span>
          </div>

          <div className="intel-card-body">
            <div className="route-delay-detail">
              <div className="delay-route-header">
                <span className="route-num">Route 21G</span>
                <span className="delay-badge text-orange">+17 min Delay</span>
              </div>
              
              <div className="delay-time-comparison">
                <div>
                  <span className="time-lbl">Expected</span>
                  <span className="time-val">42 min</span>
                </div>
                <div className="arrow-flow"><ArrowRight size={14} /></div>
                <div>
                  <span className="time-lbl">Actual</span>
                  <span className="time-val text-red">59 min</span>
                </div>
              </div>
            </div>

            <div className="likely-causes-block">
              <span className="section-small-lbl">LIKELY CAUSES (AI Correlated)</span>
              
              <div className="cause-progress-row">
                <div className="cause-header">
                  <span>Traffic Congestion</span>
                  <span>55%</span>
                </div>
                <div className="cause-progress-bar">
                  <div className="cause-fill bg-orange" style={{ width: '55%' }}></div>
                </div>
              </div>

              <div className="cause-progress-row">
                <div className="cause-header">
                  <span>Waterlogging</span>
                  <span>25%</span>
                </div>
                <div className="cause-progress-bar">
                  <div className="cause-fill bg-blue" style={{ width: '25%' }}></div>
                </div>
              </div>

              <div className="cause-progress-row">
                <div className="cause-header">
                  <span>Signal Delay</span>
                  <span>15%</span>
                </div>
                <div className="cause-progress-bar">
                  <div className="cause-fill bg-purple" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>

            <div className="historical-delay-graph">
              <span className="section-small-lbl">T. Nagar Weekly Delay Trend (Avg)</span>
              <div className="weekly-bars-container">
                <div className="week-bar-col">
                  <div className="bar-fill" style={{ height: '70%', backgroundColor: '#f97316' }}></div>
                  <span className="bar-day">M</span>
                </div>
                <div className="week-bar-col">
                  <div className="bar-fill" style={{ height: '85%', backgroundColor: '#f97316' }}></div>
                  <span className="bar-day">T</span>
                </div>
                <div className="week-bar-col">
                  <div className="bar-fill" style={{ height: '80%', backgroundColor: '#f97316' }}></div>
                  <span className="bar-day">W</span>
                </div>
                <div className="week-bar-col">
                  <div className="bar-fill" style={{ height: '95%', backgroundColor: '#ef4444' }}></div>
                  <span className="bar-day">T</span>
                </div>
                <div className="week-bar-col">
                  <div className="bar-fill" style={{ height: '75%', backgroundColor: '#f97316' }}></div>
                  <span className="bar-day">F</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="intel-card-action-btn"
            onClick={() => setActivePage('Bus Delay')}
          >
            View Delay Analysis &rarr;
          </button>
        </div>

        {/* Card 4: Waterlogging Intelligence */}
        <div className="card intel-card-detail">
          <div className="card-top border-blue-top">
            <h3 className="intel-card-title">Waterlogging Intelligence</h3>
            <span className="badge badge-blue-outline">Hydrology Impact</span>
          </div>

          <div className="intel-card-body">
            <div className="waterlogging-location-focus">
              <span className="water-lbl">Location Focus</span>
              <h4 className="water-loc">Tambaram Main Road</h4>
            </div>

            <div className="water-telemetry-grid">
              <div className="water-tel-box">
                <span className="wt-lbl">Detections</span>
                <span className="wt-val">14</span>
              </div>
              <div className="water-tel-box">
                <span className="wt-lbl">Buses Affected</span>
                <span className="wt-val">8</span>
              </div>
              <div className="water-tel-box">
                <span className="wt-lbl">Speed Drop</span>
                <span className="wt-val text-red">-42%</span>
              </div>
              <div className="water-tel-box">
                <span className="wt-lbl">Persistence</span>
                <span className="wt-val">4 Hours</span>
              </div>
            </div>

            <div className="water-evidence-placeholder">
              <svg viewBox="0 0 150 45" className="water-evidence-svg" width="100%">
                <rect width="150" height="45" rx="4" fill="#0f172a" />
                {/* Wavy Waterlines */}
                <path d="M 0,25 Q 25,18 50,25 T 100,25 T 150,25 L 150,45 L 0,45 Z" fill="#2563eb" fillOpacity="0.6" />
                <path d="M 0,33 Q 30,27 60,33 T 120,33 T 150,33 L 150,45 L 0,45 Z" fill="#1d4ed8" fillOpacity="0.8" />
                {/* Bus Wheels in Water */}
                <circle cx="45" cy="27" r="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="105" cy="27" r="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                {/* Text */}
                <text x="75" y="15" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  WATER SEGMENT DETECTED
                </text>
              </svg>
            </div>

            <div className="water-verdict-action">
              <span className="wv-lbl">TRANSPORT IMPACT</span>
              <p className="wv-desc">Severe routing disruptions on Chromepet - Tambaram corridor.</p>
              <div className="rec-box-blue">
                <strong>Recommended:</strong> Drainage maintenance / road inspection alert.
              </div>
            </div>
          </div>

          <button 
            className="intel-card-action-btn"
            onClick={() => setActivePage('Waterlogging')}
          >
            View Waterlog Intel &rarr;
          </button>
        </div>
      </div>

      {/* Core Innovation Cross Event & Verification Panels */}
      <div className="two-column-layout mt-4">
        <CrossEventIntelligence />
        <MultiBusVerification />
      </div>

      {/* Priority Alerts Queue & Bottom Workflow */}
      <div className="mt-4">
        <PriorityAlerts />
      </div>

      <div className="mt-4">
        <HowItWorks />
      </div>

      {/* Alert Detail Dialog */}
      <AlertDetailModal />
    </div>
  );
}
