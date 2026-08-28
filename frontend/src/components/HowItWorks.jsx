import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { Camera, Cpu, MapPin, Server, Network, BarChart3, AlertCircle, ArrowRight, Check } from 'lucide-react';

export default function HowItWorks() {
  const { activeStage, simulationActive } = useCommandCenter();

  const steps = [
    { num: 1, label: 'BUS CAMERAS', icon: Camera, desc: 'Mobile telemetry' },
    { num: 2, label: 'EDGE AI DETECTION', icon: Cpu, desc: 'Visual models' },
    { num: 3, label: 'GPS + TIMESTAMP', icon: MapPin, desc: 'Spatial tagging' },
    { num: 4, label: 'CENTRAL PLATFORM', icon: Server, desc: 'Data ingestion' },
    { num: 5, label: 'MULTI-BUS VERIFICATION', icon: Network, desc: 'Evidence filter' },
    { num: 6, label: 'PATTERN & CAUSE', icon: BarChart3, desc: 'Trend correlation' },
    { num: 7, label: 'ACTIONABLE ALERT', icon: AlertCircle, desc: 'Command dispatch' }
  ];

  return (
    <div className="card how-it-works-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">7-Stage Observation-to-Alert Pipeline Workflow</h3>
          <span className="card-subtitle">How URBAN EYE translates mobile observation streams into urban intelligence</span>
        </div>
        {simulationActive && (
          <span className="live-pill bg-purple text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <span className="pulse-dot"></span> Stage {activeStage}/7 Active
          </span>
        )}
      </div>

      <div className="workflow-horizontal-row mt-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = activeStage > step.num;
          const isActive = activeStage === step.num;

          return (
            <React.Fragment key={step.label}>
              <div 
                className={`workflow-step-box ${isDone ? 'step-completed' : ''} ${isActive ? 'step-active-glow' : ''}`}
                style={{
                  border: isActive ? '2px solid #7c3aed' : isDone ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: isActive ? 'rgba(124, 58, 237, 0.12)' : isDone ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="step-num flex items-center justify-center">
                  {isDone ? (
                    <Check size={14} className="text-green-400 font-bold" />
                  ) : (
                    <span>{step.num}</span>
                  )}
                </div>

                <div 
                  className="workflow-icon-circle"
                  style={{
                    backgroundColor: isActive ? '#7c3aed' : isDone ? '#10b981' : 'rgba(255,255,255,0.05)',
                    color: (isActive || isDone) ? '#ffffff' : '#94a3b8'
                  }}
                >
                  <Icon size={18} />
                </div>

                <h4 className="workflow-step-label" style={{ color: isActive ? '#a855f7' : isDone ? '#34d399' : '#f8fafc' }}>
                  {step.label}
                </h4>
                <p className="workflow-step-desc">{step.desc}</p>

                {isDone && (
                  <span className="stage-check-badge" style={{ color: '#10b981', fontSize: '11px', fontWeight: 'bold' }}>
                    ✓ Done
                  </span>
                )}
              </div>
              
              {idx < steps.length - 1 && (
                <div className="workflow-flow-arrow" style={{ color: isDone ? '#10b981' : '#475569' }}>
                  <ArrowRight size={16} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
