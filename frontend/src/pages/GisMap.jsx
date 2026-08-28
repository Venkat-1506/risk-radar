import React, { useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import CityMap from '../components/CityMap';
import { Layers, MapPin, CheckCircle, Info, ShieldAlert, Navigation } from 'lucide-react';

export default function GisMap() {
  const { alerts, mapMarkers, selectedAlert, setSelectedAlert } = useCommandCenter();
  const [activeLayers, setActiveLayers] = useState({
    accident: true,
    waterlogging: true,
    delay: true,
    safety: true,
    active_bus: true
  });

  const handleToggleLayer = (layer) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="sub-page gis-map-page-container">
      <div className="sub-page-header border-purple-bottom">
        <div>
          <span className="sub-page-tag text-purple">GEOGRAPHIC INFORMATION SYSTEM</span>
          <h2 className="sub-page-title">Full-Screen GIS Intelligence Map</h2>
        </div>
      </div>

      <div className="gis-layout-row mt-3">
        {/* Left Map Area */}
        <div className="gis-map-panel">
          <CityMap />
        </div>

        {/* Right Detail Drawer */}
        <div className="gis-side-drawer">
          {/* Layer Selection */}
          <div className="card drawer-card">
            <h3 className="drawer-title flex-align-center">
              <Layers size={16} className="mr-1 color-purple" /> GIS Map Layer Control
            </h3>
            
            <div className="layer-checkbox-list mt-3">
              <label className="checkbox-row">
                <input 
                  type="checkbox" 
                  checked={activeLayers.accident} 
                  onChange={() => handleToggleLayer('accident')} 
                />
                <span className="checkbox-label"><span className="legend-dot bg-red mr-1"></span> Accident Risk Zones</span>
              </label>

              <label className="checkbox-row">
                <input 
                  type="checkbox" 
                  checked={activeLayers.waterlogging} 
                  onChange={() => handleToggleLayer('waterlogging')} 
                />
                <span className="checkbox-label"><span className="legend-dot bg-blue mr-1"></span> Persistent Waterlogging</span>
              </label>

              <label className="checkbox-row">
                <input 
                  type="checkbox" 
                  checked={activeLayers.delay} 
                  onChange={() => handleToggleLayer('delay')} 
                />
                <span className="checkbox-label"><span className="legend-dot bg-orange mr-1"></span> Bus Delay Hotspots</span>
              </label>

              <label className="checkbox-row">
                <input 
                  type="checkbox" 
                  checked={activeLayers.safety} 
                  onChange={() => handleToggleLayer('safety')} 
                />
                <span className="checkbox-label"><span className="legend-dot bg-purple mr-1"></span> Bus Safety / Density</span>
              </label>

              <label className="checkbox-row">
                <input 
                  type="checkbox" 
                  checked={activeLayers.active_bus} 
                  onChange={() => handleToggleLayer('active_bus')} 
                />
                <span className="checkbox-label"><span className="legend-dot bg-green mr-1"></span> Active Fleet Buses</span>
              </label>
            </div>
          </div>

          {/* Marker Details Card */}
          <div className="card drawer-card mt-3">
            <h3 className="drawer-title flex-align-center">
              <MapPin size={16} className="mr-1 color-purple" /> Active Telemetry Inspection
            </h3>
            
            {selectedAlert ? (
              <div className="drawer-detail-active">
                <div className="dda-header">
                  <span className={`dda-tag ${selectedAlert.type === 'accident' ? 'bg-red-light text-red' : 'bg-blue-light text-blue'}`}>
                    {selectedAlert.type.toUpperCase()}
                  </span>
                  <span className="dda-time">{selectedAlert.time}</span>
                </div>
                
                <h4 className="dda-location">{selectedAlert.location}</h4>
                <p className="dda-desc">{selectedAlert.details}</p>

                <div className="dda-stats">
                  <div className="dda-stat-row">
                    <span className="dda-lbl">Verification confidence:</span>
                    <span className="dda-val font-semibold">{selectedAlert.confidence}%</span>
                  </div>
                  <div className="dda-stat-row">
                    <span className="dda-lbl">Observing units:</span>
                    <span className="dda-val">{selectedAlert.busesList.join(', ')}</span>
                  </div>
                  <div className="dda-stat-row">
                    <span className="dda-lbl">Coordinates:</span>
                    <span className="dda-val font-mono">{selectedAlert.coordinates.join(', ')}</span>
                  </div>
                </div>

                <div className="dda-dispatch-action bg-slate-50 p-2 rounded border mt-3 text-xs">
                  <strong>Recommended Dispatch:</strong>
                  <p className="mt-1 text-slate-600">{selectedAlert.recommendedAction}</p>
                </div>

                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="dda-close-btn mt-3"
                >
                  Clear Inspection View
                </button>
              </div>
            ) : (
              <div className="drawer-detail-empty">
                <Info size={24} className="color-slate mb-2" />
                <p>Click on any pulsing map marker in the Central view to inspect active camera observations, spatial bounds, and recommended dispatcher tasks.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
