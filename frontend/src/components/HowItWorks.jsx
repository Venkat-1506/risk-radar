import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { Camera, Cpu, MapPin, Server, Network, BarChart3, AlertCircle, Check } from 'lucide-react';

export default function HowItWorks() {
  const { activeStage, simulationActive } = useCommandCenter();

  const steps = [
    { num: 1, label: 'Bus Cameras', icon: Camera, desc: 'Mobile telemetry' },
    { num: 2, label: 'Edge AI Detection', icon: Cpu, desc: 'Visual models' },
    { num: 3, label: 'GPS + Timestamp', icon: MapPin, desc: 'Spatial tagging' },
    { num: 4, label: 'Central Platform', icon: Server, desc: 'Data ingestion' },
    { num: 5, label: 'Multi-Bus Verification', icon: Network, desc: 'Evidence filter' },
    { num: 6, label: 'Pattern & Cause', icon: BarChart3, desc: 'Trend correlation' },
    { num: 7, label: 'Actionable Alert', icon: AlertCircle, desc: 'Command dispatch' }
  ];

  const completedCount = activeStage === 0 ? 0 : Math.min(activeStage, 7);
  const progressPct = (completedCount / steps.length) * 100;

  return (
    <div className="card workflow-card">
      <div className="workflow-header">
        <div className="workflow-heading">
          <span className="workflow-logo-badge">
            <img src="/logo.png" alt="URBAN EYE logo" />
          </span>
          <div className="workflow-heading-copy">
            <span className="workflow-kicker">Incident Lifecycle</span>
            <h3 className="workflow-title">7-Stage Observation-to-Alert Pipeline Workflow</h3>
            <p className="workflow-subtitle">
              How <strong>URBAN EYE</strong> translates mobile observation streams into urban intelligence
            </p>
          </div>
        </div>

        <div className="workflow-header-actions">
          <span className={`workflow-status-pill ${simulationActive ? 'is-live' : ''}`}>
            <span className="workflow-status-dot" />
            {simulationActive ? `Stage ${activeStage}/7 Running` : '7 Stages Ready'}
          </span>

          <div className="workflow-progress-chip">
            <div className="workflow-progress-ring" style={{ '--progress': `${progressPct}%` }}>
              <span>{completedCount}/{steps.length}</span>
            </div>
            <div className="workflow-progress-copy">
              <span>Pipeline Progress</span>
              <strong>{completedCount} of {steps.length} stages</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="workflow-steps">
        {steps.map((step) => {
          const Icon = step.icon;
          const isDone = activeStage > step.num;
          const isActive = activeStage === step.num;

          return (
            <div
              key={step.label}
              className={`workflow-step ${isDone ? 'is-done' : ''} ${isActive ? 'is-active' : ''}`}
            >
              <div className="workflow-step-top">
                <span className="workflow-step-index">{String(step.num).padStart(2, '0')}</span>
                <span className="workflow-icon">
                  {isDone ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                </span>
              </div>

              <div className="workflow-step-copy">
                <h4 className="workflow-step-label">{step.label}</h4>
                <p className="workflow-step-desc">{step.desc}</p>
              </div>

              <span className="workflow-step-state">
                <span className="workflow-state-dot" />
                {isDone ? 'Completed' : isActive ? 'In progress' : 'Queued'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
