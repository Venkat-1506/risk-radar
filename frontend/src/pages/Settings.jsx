import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Sliders, Database, Cpu, Wifi } from 'lucide-react';

export default function Settings() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [edgeProcessing, setEdgeProcessing] = useState(true);

  return (
    <div className="sub-page settings-page">
      <div className="sub-page-header border-purple-bottom">
        <div>
          <span className="sub-page-tag text-purple">SYSTEM PARAMETERS</span>
          <h2 className="sub-page-title">Command Center Settings</h2>
        </div>
      </div>

      <div className="sub-page-layout-grid mt-4">
        {/* Left Col: Configurations */}
        <div className="layout-left-col-6">
          <div className="card">
            <h3 className="card-title flex-align-center mb-3">
              <Sliders size={18} className="color-purple mr-1" /> Telemetry Processing Thresholds
            </h3>

            <div className="settings-controls-group">
              <div className="setting-control-row">
                <div className="sc-info">
                  <span className="sc-label">AI Object Bounding Confidence</span>
                  <span className="sc-desc">Filter edge detections falling below this rating. Current: {confidenceThreshold}%</span>
                </div>
                <div className="sc-input">
                  <input 
                    type="range" 
                    min="50" 
                    max="95" 
                    value={confidenceThreshold} 
                    onChange={(e) => setConfidenceThreshold(Number(e.target.value))} 
                    className="slider-input-bar"
                  />
                </div>
              </div>

              <div className="setting-control-row">
                <div className="sc-info">
                  <span className="sc-label">Automated Dispatcher Routing</span>
                  <span className="sc-desc">Prompt dispatcher immediately when multi-bus reliability reaches HIGH status.</span>
                </div>
                <div className="sc-input">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={autoDispatch} 
                      onChange={(e) => setAutoDispatch(e.target.checked)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-control-row">
                <div className="sc-info">
                  <span className="sc-label">Edge Node Processing Mode</span>
                  <span className="sc-desc">Execute visual AI models on-vehicle (Edge AI) rather than streaming raw CCTV logs.</span>
                </div>
                <div className="sc-input">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={edgeProcessing} 
                      onChange={(e) => setEdgeProcessing(e.target.checked)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <h3 className="card-title flex-align-center mb-3">
              <Shield size={18} className="color-purple mr-1" /> Privacy & Spatial Security Rules
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              The URBAN EYE central platform operates in strict compliance with public transport observation frameworks.
            </p>
            <div className="privacy-checks text-xs">
              <div className="flex-align-center mb-2 text-green">
                <span className="mr-1">&bull;</span> Anonymized face-blur algorithms executed on-vehicle (Edge node)
              </div>
              <div className="flex-align-center mb-2 text-green">
                <span className="mr-1">&bull;</span> Zero retention of high-resolution video streams (Telemetry logs only)
              </div>
              <div className="flex-align-center text-green">
                <span className="mr-1">&bull;</span> Encryption standards: AES-256 telemetry packet transfer
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Connection status */}
        <div className="layout-right-col-6">
          <div className="card bg-dark-navy text-white">
            <h3 className="card-title text-white flex-align-center mb-3">
              <Wifi size={18} className="color-purple mr-1" /> Edge Nodes Connection Status
            </h3>
            
            <div className="edge-nodes-status-list text-xs">
              <div className="ens-row">
                <span>Active Bus Fleet Nodes (Cams):</span>
                <span className="text-green font-semibold">121/121 Online</span>
              </div>
              <div className="ens-row">
                <span>MTC GIS Database Link:</span>
                <span className="text-green font-semibold">Synchronized</span>
              </div>
              <div className="ens-row">
                <span>Chennai Traffic Command API:</span>
                <span className="text-green font-semibold">Connected (0.8s ping)</span>
              </div>
              <div className="ens-row">
                <span>Central Processing Cluster:</span>
                <span className="text-green font-semibold">Nominal Load (14%)</span>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <h3 className="card-title flex-align-center mb-3">
              <Database size={18} className="color-purple mr-1" /> Platform Version
            </h3>
            <div className="text-xs text-slate-500">
              <div className="flex-justify-between mb-2">
                <span>Core version:</span>
                <span className="font-semibold">URBAN EYE v2.4.1 (Stable)</span>
              </div>
              <div className="flex-justify-between mb-2">
                <span>Edge inference model:</span>
                <span className="font-semibold">UrbanNet-Vision v3.2</span>
              </div>
              <div className="flex-justify-between">
                <span>Target Node deployment:</span>
                <span className="font-semibold">Chennai Metropolitan Transport Area</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
