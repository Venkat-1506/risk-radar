import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { Camera, Cpu, CheckCircle2, ScanLine, Loader2 } from 'lucide-react';

export default function LiveBusFeed() {
  const { feedData, activeStage, simulationActive, scenarioAnalyzing } = useCommandCenter();

  const getOverlayColor = () => {
    const label = (feedData.detection || '').toLowerCase();
    if (label.includes('waterlog')) return { border: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.25)', badgeBg: '#0284c7' };
    if (label.includes('pothole') || label.includes('damage')) return { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.25)', badgeBg: '#d97706' };
    if (label.includes('accident')) return { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.25)', badgeBg: '#dc2626' };
    return { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.25)', badgeBg: '#9333ea' };
  };

  const theme = getOverlayColor();
  const backendBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const resolveImageUrl = (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    // Local /assets frames ship with the frontend build; /data frames are
    // served by the FastAPI static mount.
    if (path.startsWith('/data/')) return `${backendBase}${path}`;
    return encodeURI(path);
  };

  const imageUrl = resolveImageUrl(feedData.imagePath);
  const isAnalyzing = scenarioAnalyzing || (simulationActive && activeStage >= 1 && activeStage < 2);
  const isAIDetected = !isAnalyzing && (activeStage >= 2 || (feedData.confidence !== null && feedData.confidence !== undefined));

  return (
    <div className="card live-feed-card bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="card-header-row flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div>
          <h3 className="card-title text-base font-bold text-white flex items-center gap-2">
            <Camera size={18} className="text-purple-400" />
            BUS CAMERA FEED
          </h3>
          <span className="card-subtitle text-xs text-slate-400">
            {feedData.busId} • {feedData.route} • {feedData.location || 'Tambaram Main Road'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isAnalyzing ? (
            <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <ScanLine size={12} className="animate-pulse" />
              AI ANALYSIS IN PROGRESS
            </span>
          ) : (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              CAMERA FRAME RECEIVED
            </span>
          )}
        </div>
      </div>

      <div className="camera-screen-container relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        {/* CCTV Scanlines overlay */}
        <div className="cctv-scanline absolute inset-0 pointer-events-none z-10 opacity-30"></div>

        {/* Camera Image Display */}
        <div className="cctv-video-canvas relative w-full h-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Bus Front Camera Feed"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs font-mono">
              AWAITING CAMERA FRAME...
            </div>
          )}

          <div className="cctv-grid-overlay" />

          {/* Live analysis sweep while the edge model processes the frame */}
          {isAnalyzing && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="camera-scan-sweep" />
              <span className="analysis-corner analysis-corner-tl" />
              <span className="analysis-corner analysis-corner-tr" />
              <span className="analysis-corner analysis-corner-bl" />
              <span className="analysis-corner analysis-corner-br" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-sky-500/20 border border-sky-400/50 text-sky-300 text-[10px] font-mono font-bold px-2 py-1 rounded">
                <Loader2 size={11} className="animate-spin" />
                ANALYSING FRAME...
              </div>
            </div>
          )}

          {/* AI Bounding Box Overlay */}
          {isAIDetected && (
            <div
              className="ai-bounding-box absolute transition-all duration-500 border-2 rounded shadow-2xl flex flex-col justify-between p-1.5 z-20"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.bg,
                top: '25%',
                left: '20%',
                width: '60%',
                height: '52%'
              }}
            >
              <div
                className="ai-box-badge text-white font-mono text-[11px] font-bold px-2 py-1 rounded flex items-center justify-between shadow-md"
                style={{ backgroundColor: theme.badgeBg }}
              >
                <span className="flex items-center gap-1">
                  <Cpu size={12} />
                  {feedData.detection}
                </span>
                <span className="bg-black/40 px-1.5 py-0.5 rounded text-[10px]">
                  {feedData.confidence ? `${feedData.confidence}% CONF` : 'DETECTED'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono font-bold bg-slate-950/80 px-2 py-0.5 rounded text-white border border-slate-700/50">
                <span>SEVERITY: <strong className="text-red-400">{feedData.severity || 'HIGH'}</strong></span>
                <span>INFERENCE: <strong className="text-cyan-400">{feedData.inferenceMs || 182}ms</strong></span>
              </div>
            </div>
          )}

          {/* CCTV OSD Tags */}
          <div className="absolute top-2 left-2 text-[10px] font-mono font-bold bg-black/60 text-emerald-400 px-2 py-1 rounded flex items-center gap-1 z-20">
            <Camera size={10} /> {feedData.busId} • FRONT CAM
          </div>

          <div className="absolute top-2 right-2 text-[10px] font-mono font-bold bg-black/60 text-slate-300 px-2 py-1 rounded z-20">
            {feedData.time || '10:46 AM'}
          </div>
        </div>
      </div>

      {/* Telemetry Summary Footer */}
      <div className="live-feed-footer grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
        <div className="bg-slate-950 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">BUS IDENTITY</span>
          <span className="font-bold text-white">{feedData.busId} ({feedData.route})</span>
        </div>
        <div className="bg-slate-950 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">LOCATION TAG</span>
          <span className="font-bold text-cyan-400 truncate block">{feedData.location || 'Tambaram Main Road'}</span>
        </div>
        <div className="bg-slate-950 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">EDGE AI ENGINE</span>
          <span className="font-bold text-purple-400 flex items-center gap-1">
            <Cpu size={12} /> YOLO INCIDENT
          </span>
        </div>
        <div className="bg-slate-950 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">PIPELINE STATUS</span>
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={12} /> {feedData.status || 'READY'}
          </span>
        </div>
      </div>
    </div>
  );
}

