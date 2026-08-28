import React from 'react';
import { BarChart3, TrendingUp, Clock, AlertTriangle, ShieldCheck, Droplet } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="sub-page analytics-page">
      <div className="sub-page-header border-purple-bottom">
        <div>
          <span className="sub-page-tag text-purple">DECISION SUPPORT ENGINE</span>
          <h2 className="sub-page-title">Executive Telemetry Analytics</h2>
        </div>
      </div>

      <div className="analytics-charts-grid mt-4">
        {/* Chart 1: Accident Frequency by Location */}
        <div className="card chart-card">
          <div className="chart-header-row mb-3">
            <div>
              <h4 className="chart-card-title flex-align-center">
                <AlertTriangle size={15} className="color-red mr-1" /> Accident Hotspot Frequency
              </h4>
              <span className="card-subtitle">Aggregated visual warnings (30-day window)</span>
            </div>
          </div>
          
          <div className="svg-chart-container" style={{ height: '200px' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 180">
              {/* Grid Lines */}
              <line x1="100" y1="20" x2="380" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="100" y1="50" x2="380" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="100" y1="80" x2="380" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="100" y1="110" x2="380" y2="110" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="100" y1="140" x2="380" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="100" y1="170" x2="380" y2="170" stroke="#94a3b8" strokeWidth="1" />

              {/* Bar 1: Guindy */}
              <text x="90" y="35" fill="#475569" fontSize="11" textAnchor="end" fontFamily="sans-serif">Guindy Jn</text>
              <rect x="100" y="24" width="240" height="15" rx="3" fill="#ef4444" />
              <text x="350" y="36" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="sans-serif">8 inc.</text>

              {/* Bar 2: Anna Nagar */}
              <text x="90" y="65" fill="#475569" fontSize="11" textAnchor="end" fontFamily="sans-serif">Anna Nagar</text>
              <rect x="100" y="54" width="180" height="15" rx="3" fill="#ef4444" fillOpacity="0.8" />
              <text x="290" y="66" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="sans-serif">6 inc.</text>

              {/* Bar 3: Koyambedu */}
              <text x="90" y="95" fill="#475569" fontSize="11" textAnchor="end" fontFamily="sans-serif">Koyambedu</text>
              <rect x="100" y="84" width="150" height="15" rx="3" fill="#ef4444" fillOpacity="0.75" />
              <text x="260" y="96" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="sans-serif">5 inc.</text>

              {/* Bar 4: T. Nagar */}
              <text x="90" y="125" fill="#475569" fontSize="11" textAnchor="end" fontFamily="sans-serif">T. Nagar</text>
              <rect x="100" y="114" width="120" height="15" rx="3" fill="#f97316" />
              <text x="230" y="126" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="sans-serif">4 inc.</text>

              {/* Bar 5: Velachery */}
              <text x="90" y="155" fill="#475569" fontSize="11" textAnchor="end" fontFamily="sans-serif">Velachery</text>
              <rect x="100" y="144" width="90" height="15" rx="3" fill="#f97316" fillOpacity="0.8" />
              <text x="200" y="156" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="sans-serif">3 inc.</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Bus Delay Trend (Weekly Aggregate) */}
        <div className="card chart-card">
          <div className="chart-header-row mb-3">
            <div>
              <h4 className="chart-card-title flex-align-center">
                <Clock size={15} className="color-orange mr-1" /> Bus Delay Coefficient Trend
              </h4>
              <span className="card-subtitle">Aggregate weekly scheduled arrival deviations (minutes)</span>
            </div>
          </div>
          
          <div className="svg-chart-container" style={{ height: '200px' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 180" preserveAspectRatio="none">
              {/* Background grid */}
              <line x1="30" y1="20" x2="380" y2="20" stroke="#f8fafc" strokeWidth="1" />
              <line x1="30" y1="60" x2="380" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="100" x2="380" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="140" x2="380" y2="140" stroke="#94a3b8" strokeWidth="1" />

              {/* Y Axis labels */}
              <text x="25" y="24" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">25m</text>
              <text x="25" y="64" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">15m</text>
              <text x="25" y="104" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">5m</text>
              <text x="25" y="144" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">0m</text>

              {/* Line graph points: Mon (30, 110), Tue (90, 80), Wed (150, 95), Thu (210, 40), Fri (270, 75), Sat (330, 120), Sun (380, 135) */}
              <path 
                d="M 30,110 L 90,80 L 150,95 L 210,40 L 270,75 L 330,120 L 380,135" 
                fill="none" 
                stroke="#f97316" 
                strokeWidth="3" 
              />
              <path 
                d="M 30,110 L 90,80 L 150,95 L 210,40 L 270,75 L 330,120 L 380,135 L 380,140 L 30,140 Z" 
                fill="rgba(249, 115, 22, 0.08)" 
              />

              {/* Graph nodes dots */}
              <circle cx="30" cy="110" r="4" fill="#f97316" />
              <circle cx="90" cy="80" r="4" fill="#f97316" />
              <circle cx="150" cy="95" r="4" fill="#f97316" />
              <circle cx="210" cy="40" r="4" fill="#ef4444" /> {/* Peak Thursday */}
              <circle cx="270" cy="75" r="4" fill="#f97316" />
              <circle cx="330" cy="120" r="4" fill="#f97316" />
              <circle cx="380" cy="135" r="4" fill="#f97316" />

              {/* X Axis labels */}
              <text x="30" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Mon</text>
              <text x="90" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Tue</text>
              <text x="150" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Wed</text>
              <text x="210" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Thu</text>
              <text x="270" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Fri</text>
              <text x="330" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Sat</text>
              <text x="380" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Sun</text>
            </svg>
          </div>
        </div>

        {/* Chart 3: Waterlogging Persistence Duration */}
        <div className="card chart-card">
          <div className="chart-header-row mb-3">
            <div>
              <h4 className="chart-card-title flex-align-center">
                <Droplet size={15} className="color-blue mr-1" /> Inundation Segment Persistence
              </h4>
              <span className="card-subtitle">Continuous water-logged hours tracked at site</span>
            </div>
          </div>
          
          <div className="svg-chart-container" style={{ height: '200px' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 180">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="380" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="380" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="140" x2="380" y2="140" stroke="#94a3b8" strokeWidth="1" />

              {/* Y Labels */}
              <text x="35" y="24" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">6 Hrs</text>
              <text x="35" y="64" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">4 Hrs</text>
              <text x="35" y="104" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">2 Hrs</text>
              <text x="35" y="144" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">0 Hrs</text>

              {/* Columns: Tambaram (4h), Chromepet (5h), Velachery (2h), Koyambedu (1h) */}
              {/* Tambaram */}
              <rect x="70" y="60" width="36" height="80" rx="3" fill="#0ea5e9" />
              <text x="88" y="52" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">4h</text>
              <text x="88" y="156" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Tambaram</text>

              {/* Chromepet */}
              <rect x="150" y="40" width="36" height="100" rx="3" fill="#2563eb" />
              <text x="168" y="32" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">5h</text>
              <text x="168" y="156" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Chromepet</text>

              {/* Velachery */}
              <rect x="230" y="100" width="36" height="40" rx="3" fill="#0ea5e9" fillOpacity="0.75" />
              <text x="248" y="92" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">2h</text>
              <text x="248" y="156" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Velachery</text>

              {/* Koyambedu */}
              <rect x="310" y="120" width="36" height="20" rx="3" fill="#0ea5e9" fillOpacity="0.5" />
              <text x="328" y="112" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">1h</text>
              <text x="328" y="156" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Koyambedu</text>
            </svg>
          </div>
        </div>

        {/* Chart 4: Passenger Occupancy Diurnal Cycle */}
        <div className="card chart-card">
          <div className="chart-header-row mb-3">
            <div>
              <h4 className="chart-card-title flex-align-center">
                <ShieldCheck size={15} className="color-purple mr-1" /> Passenger Density Cycle
              </h4>
              <span className="card-subtitle">Aggregate fleet occupancy ratios vs legal capacity bounds</span>
            </div>
          </div>
          
          <div className="svg-chart-container" style={{ height: '200px' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 180" preserveAspectRatio="none">
              {/* Background grid */}
              <line x1="30" y1="20" x2="380" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="50" x2="380" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="80" x2="380" y2="80" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4" /> {/* Legal safety limit line */}
              <line x1="30" y1="110" x2="380" y2="110" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="140" x2="380" y2="140" stroke="#94a3b8" strokeWidth="1" />

              {/* Y Labels */}
              <text x="25" y="24" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">150%</text>
              <text x="25" y="54" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">120%</text>
              <text x="25" y="84" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">100% (LIMIT)</text>
              <text x="25" y="114" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">50%</text>
              <text x="25" y="144" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">0%</text>

              {/* Area graph path: 7 AM (40, 120), 9 AM (90, 38), 12 PM (150, 110), 3 PM (210, 100), 6 PM (270, 30), 9 PM (330, 90), 11 PM (380, 130) */}
              <path 
                d="M 30,120 Q 60,110 90,38 T 150,110 T 210,100 T 270,30 T 330,90 T 380,130" 
                fill="none" 
                stroke="#7c3aed" 
                strokeWidth="2.5" 
              />
              <path 
                d="M 30,120 Q 60,110 90,38 T 150,110 T 210,100 T 270,30 T 330,90 T 380,130 L 380,140 L 30,140 Z" 
                fill="rgba(124, 58, 237, 0.08)" 
              />

              {/* X Labels */}
              <text x="30" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">06 AM</text>
              <text x="90" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">09 AM</text>
              <text x="150" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">12 PM</text>
              <text x="210" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">03 PM</text>
              <text x="270" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">06 PM</text>
              <text x="330" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">09 PM</text>
              <text x="380" y="160" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="sans-serif">11 PM</text>
            </svg>
          </div>
        </div>

        {/* Chart 5: Alerts Ratio by Category */}
        <div className="card chart-card full-width-chart">
          <div className="chart-header-row mb-3">
            <div>
              <h4 className="chart-card-title flex-align-center">
                <BarChart3 size={15} className="color-purple mr-1" /> Telemetry Warnings by Category
              </h4>
              <span className="card-subtitle">Distribution of active alerts across safety channels</span>
            </div>
          </div>
          
          <div className="donut-chart-layout">
            <div className="donut-graphic">
              {/* SVG Ring Donut Chart */}
              <svg width="150" height="150" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                {/* Red Slice (Accident Risk) - 30% (dasharray: 2 * pi * 32 = ~201, stroke-dashoffset: 0 to 60) */}
                <circle cx="50" cy="50" r="32" fill="transparent" stroke="#ef4444" strokeWidth="14" strokeDasharray="201" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                {/* Blue Slice (Waterlogging) - 25% (dasharray: 201, offsets 60 to 110) */}
                <circle cx="50" cy="50" r="32" fill="transparent" stroke="#0ea5e9" strokeWidth="14" strokeDasharray="201" strokeDashoffset="140.7" transform="rotate(-90 50 50)" />
                {/* Orange Slice (Delays) - 25% */}
                <circle cx="50" cy="50" r="32" fill="transparent" stroke="#f97316" strokeWidth="14" strokeDasharray="201" strokeDashoffset="90.5" transform="rotate(-90 50 50)" />
                {/* Purple Slice (Safety) - 20% */}
                <circle cx="50" cy="50" r="32" fill="transparent" stroke="#a855f7" strokeWidth="14" strokeDasharray="201" strokeDashoffset="50.2" transform="rotate(-90 50 50)" />
                {/* Donut Center */}
                <circle cx="50" cy="50" r="22" fill="#ffffff" />
                <text x="50" y="54" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">100%</text>
              </svg>
            </div>

            <div className="donut-legend-list">
              <div className="dl-item">
                <span className="dl-dot bg-red"></span>
                <span className="dl-label">Accident Risk:</span>
                <span className="dl-val">30% (35 Alerts)</span>
              </div>
              <div className="dl-item">
                <span className="dl-dot bg-blue"></span>
                <span className="dl-label">Waterlogging:</span>
                <span className="dl-val">25% (28 Alerts)</span>
              </div>
              <div className="dl-item">
                <span className="dl-dot bg-orange"></span>
                <span className="dl-label">Bus Delays:</span>
                <span className="dl-val">25% (28 Alerts)</span>
              </div>
              <div className="dl-item">
                <span className="dl-dot bg-purple"></span>
                <span className="dl-label">Bus Safety:</span>
                <span className="dl-val">20% (24 Alerts)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
