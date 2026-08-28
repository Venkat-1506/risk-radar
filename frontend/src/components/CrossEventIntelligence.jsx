import React from 'react';
import { ArrowRight, Link2, AlertCircle, TrendingDown, Clock, CloudRain, ShieldAlert } from 'lucide-react';

export default function CrossEventIntelligence() {
  return (
    <div className="card cross-intel-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Cross-Event Intelligence Correlation</h3>
          <span className="card-subtitle">AI Multi-Factor Pattern Association</span>
        </div>
        <span className="badge badge-intel-active">Active Correlation Engine</span>
      </div>

      <div className="cross-intel-grid">
        {/* Pattern Chain 1 */}
        <div className="intel-chain-box">
          <div className="chain-header">
            <CloudRain size={16} className="color-blue" />
            <h4 className="chain-title">HYDROLOGICAL TRANSIT IMPACT</h4>
          </div>
          
          <div className="chain-flow">
            <div className="flow-step">
              <span className="step-tag tag-water">Waterlogging</span>
              <span className="step-detail">Tambaram Main Road</span>
            </div>
            
            <div className="flow-arrow-icon"><ArrowRight size={14} /></div>
            
            <div className="flow-step">
              <span className="step-tag tag-slowdown">Traffic Slowdown</span>
              <span className="step-detail">Telemetry verified</span>
            </div>

            <div className="flow-arrow-icon"><ArrowRight size={14} /></div>

            <div className="flow-step">
              <span className="step-tag tag-speed">Speed -42%</span>
              <span className="step-detail">Bus engine stats</span>
            </div>

            <div className="flow-arrow-icon"><ArrowRight size={14} /></div>

            <div className="flow-step">
              <span className="step-tag tag-delay">Bus Delay</span>
              <span className="step-detail">+11 min travel spike</span>
            </div>
          </div>

          <div className="chain-correlation-insight">
            <Link2 size={14} className="insight-icon" />
            <p className="insight-text">
              <strong>Correlation Confirmed:</strong> Waterlogging observations at Tambaram are associated with recurring bus delays on routes 21G, 91, and 570.
            </p>
          </div>
        </div>

        {/* Pattern Chain 2 */}
        <div className="intel-chain-box">
          <div className="chain-header">
            <ShieldAlert size={16} className="color-red" />
            <h4 className="chain-title">HAZARD INTERSECTION CLUSTER</h4>
          </div>
          
          <div className="chain-flow">
            <div className="flow-step">
              <span className="step-tag tag-accident">Accident Risks</span>
              <span className="step-detail">8 camera detections</span>
            </div>
            
            <div className="flow-arrow-icon"><ArrowRight size={14} /></div>
            
            <div className="flow-step">
              <span className="step-tag tag-slowdown">High Traffic Density</span>
              <span className="step-detail">Guindy Junction</span>
            </div>

            <div className="flow-arrow-icon"><ArrowRight size={14} /></div>

            <div className="flow-step">
              <span className="step-tag tag-safety">Safety Events</span>
              <span className="step-detail">Overcrowded peak</span>
            </div>

            <div className="flow-arrow-icon"><ArrowRight size={14} /></div>

            <div className="flow-step">
              <span className="step-tag tag-risk">High Risk Zone</span>
              <span className="step-detail">Guindy Junction Cluster</span>
            </div>
          </div>

          <div className="chain-correlation-insight">
            <Link2 size={14} className="insight-icon" />
            <p className="insight-text">
              <strong>Correlation Confirmed:</strong> Merging vehicle hazards and pedestrian overcrowding trends indicate Guindy Junction is a priority accident-risk node.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
