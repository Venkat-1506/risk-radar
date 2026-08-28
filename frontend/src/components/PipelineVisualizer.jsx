import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { Camera, Cpu, MapPin, Server, ShieldCheck, Activity, Bell } from 'lucide-react';

export default function PipelineVisualizer() {
  const { activeStage, simulationActive, selectedScenarioKey, scenarios } = useCommandCenter();
  const currentScenario = scenarios[selectedScenarioKey] || scenarios.waterlogging;

  const stages = [
    { id: 1, label: 'BUS CAMERAS', icon: Camera, desc: `${currentScenario.busId} Feed` },
    { id: 2, label: 'EDGE AI DETECTION', icon: Cpu, desc: 'YOLO Computer Vision' },
    { id: 3, label: 'GPS + TIMESTAMP', icon: MapPin, desc: 'Spatial Tag Attached' },
    { id: 4, label: 'CENTRAL PLATFORM', icon: Server, desc: 'FastAPI Event Ingestion' },
    { id: 5, label: 'MULTI-BUS VERIFICATION', icon: ShieldCheck, desc: '3+ Buses Corroborated' },
    { id: 6, label: 'PATTERN & CAUSE', icon: Activity, desc: 'Impact & Delay Estimate' },
    { id: 7, label: 'ACTIONABLE ALERT', icon: Bell, desc: 'Dispatched to GIS Map' }
  ];

  return (
    <div className="card pipeline-visualizer-card bg-slate-900/90 border border-purple-900/40 p-4 rounded-xl shadow-lg mb-6">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">
            END-TO-END AI PIPELINE EXECUTION
          </h3>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800/50">
          {simulationActive ? `EXECUTING STAGE 0${activeStage} / 07` : activeStage === 7 ? '✓ PIPELINE COMPLETE' : 'STANDBY MODE'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {stages.map((stg) => {
          const isCurrent = activeStage === stg.id;
          const isComplete = activeStage > stg.id;
          const IconComp = stg.icon;

          let statusClass = 'border-slate-800 bg-slate-950/60 text-slate-500';
          let badgeText = '○ PENDING';
          let badgeColor = 'text-slate-500 bg-slate-900';

          if (isCurrent) {
            statusClass = 'border-purple-500 bg-purple-950/40 text-purple-300 ring-2 ring-purple-500/50 shadow-purple-900/20';
            badgeText = '● PROCESSING';
            badgeColor = 'text-purple-400 bg-purple-900/80 animate-pulse';
          } else if (isComplete) {
            statusClass = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300';
            badgeText = '✓ COMPLETE';
            badgeColor = 'text-emerald-400 bg-emerald-950/80';
          }

          return (
            <div
              key={stg.id}
              className={`flex flex-col justify-between p-2.5 rounded-lg border transition-all duration-300 ${statusClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold opacity-75">0{stg.id}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badgeColor}`}>
                    {badgeText}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <IconComp size={14} className={isCurrent ? 'text-purple-400' : isComplete ? 'text-emerald-400' : 'text-slate-500'} />
                  <span className="text-xs font-bold truncate leading-tight text-white">{stg.label}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-1">{stg.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
