import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { Bus, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export default function MultiBusVerification() {
  const { simStep, simulationActive, connectedBuses } = useCommandCenter();

  // If simulation is not running, we show a default state representing Guindy Junction
  const activeCount = simulationActive ? Math.max(1, simStep) : 3; 
  const buses = [
    { name: 'BUS-101', active: activeCount >= 1, route: '21G' },
    { name: 'BUS-205', active: activeCount >= 2, route: '570' },
    { name: 'BUS-310', active: activeCount >= 3, route: '91' },
    { name: 'BUS-402', active: activeCount >= 4, route: '19' }
  ].concat(connectedBuses.filter(bus => bus.status === 'ACTIVE').map(bus => ({
    name: bus.bus_id,
    active: true,
    route: bus.route,
    connected: true
  })));

  const getReliability = () => {
    switch (activeCount) {
      case 1: return { label: 'OBSERVED', pct: 45, color: '#3b82f6', desc: 'Raw Observation (1 Bus)' };
      case 2: return { label: 'CORROBORATED', pct: 75, color: '#f97316', desc: 'Corroborating Evidence (2 Independent Buses)' };
      case 3: return { label: 'VERIFIED', pct: 90, color: '#10b981', desc: 'Verified / High Reliability (3 Independent Buses)' };
      case 4: return { label: 'VERIFIED', pct: 98, color: '#10b981', desc: 'Verified / High Reliability (3+ Independent Buses)' };
      default: return { label: 'VERIFIED', pct: 90, color: '#10b981', desc: 'Verified / High Reliability' };
    }
  };

  const reliability = getReliability();

  return (
    <div className="card verification-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Multi-Bus Verification</h3>
          <span className="card-subtitle">AI Observational Reliability Pipeline</span>
        </div>
        <span className="badge badge-intel">Core Innovation</span>
      </div>

      <div className="verification-visualizer">
        {/* Source Nodes (Buses) */}
        <div className="source-nodes">
          {buses.map((bus, idx) => (
            <div key={bus.name} className={`bus-node ${bus.active ? 'active-node' : 'inactive-node'}`}>
              <div className="node-bus-icon">
                <Bus size={16} />
              </div>
              <div className="node-info">
                <span className="bus-id">{bus.name}</span>
                <span className="bus-route">R-{bus.route}</span>
              </div>
              {bus.active ? (
                <span className="node-status-badge">{bus.connected ? 'Connected Unit' : 'AI Observation'}</span>
              ) : (
                <span className="node-status-badge badge-idle">Idle</span>
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Connectors / Flow Lines */}
        <div className="connector-lines-container">
          <svg className="connector-svg" width="80" height="180" viewBox="0 0 80 180">
            {/* Bus 1 -> Junction */}
            <path 
              d="M 0,25 C 40,25 40,90 80,90" 
              stroke={buses[0].active ? '#7c3aed' : '#cbd5e1'} 
              strokeWidth={buses[0].active ? '3' : '1.5'} 
              fill="none" 
              className={buses[0].active ? 'flow-dash' : ''}
            />
            {/* Bus 2 -> Junction */}
            <path 
              d="M 0,70 C 40,70 40,90 80,90" 
              stroke={buses[1].active ? '#7c3aed' : '#cbd5e1'} 
              strokeWidth={buses[1].active ? '3' : '1.5'} 
              fill="none" 
              className={buses[1].active ? 'flow-dash' : ''}
            />
            {/* Bus 3 -> Junction */}
            <path 
              d="M 0,115 C 40,115 40,90 80,90" 
              stroke={buses[2].active ? '#7c3aed' : '#cbd5e1'} 
              strokeWidth={buses[2].active ? '3' : '1.5'} 
              fill="none" 
              className={buses[2].active ? 'flow-dash' : ''}
            />
            {/* Bus 4 -> Junction */}
            <path 
              d="M 0,160 C 40,160 40,90 80,90" 
              stroke={buses[3].active ? '#7c3aed' : '#cbd5e1'} 
              strokeWidth={buses[3].active ? '3' : '1.5'} 
              fill="none" 
              className={buses[3].active ? 'flow-dash' : ''}
            />
          </svg>
        </div>

        {/* Collision Center Node (Central Junction) */}
        <div className="target-node-container">
          <div className={`target-node ${activeCount > 0 ? 'active-target' : ''}`}>
            <span className="location-label">LOCATION MATCH</span>
            <h4 className="location-name">Guindy Junction</h4>
            <span className="observations-pill">
              {activeCount} Bus Detections
            </span>
          </div>

          <div className="reliability-indicator" style={{ borderLeft: `4px solid ${reliability.color}` }}>
            <span className="indicator-label">RELIABILITY VALUE</span>
            <div className="reliability-score-row">
              <span className="reliability-rating" style={{ color: reliability.color }}>
                {reliability.label}
              </span>
              <span className="reliability-pct">{reliability.pct}%</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${reliability.pct}%`, backgroundColor: reliability.color }}
              ></div>
            </div>
            <span className="reliability-level">{reliability.desc}</span>
          </div>
        </div>
      </div>

      <div className="verification-explanation-footer">
        <p className="explain-text">
          <strong>How it works:</strong> A single bus observation forms an <em>OBSERVED</em> state (1 bus). 
          When a second independent bus detects the anomaly in the same 250m area, it is promoted to <em>CORROBORATED</em> (2 buses). 
          When 3 or more independent buses detect it, it becomes <em>VERIFIED / HIGH RELIABILITY</em> (3+ buses).
        </p>
      </div>
    </div>
  );
}
