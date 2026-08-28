import React, { useEffect, useRef, useState } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Rich Mock Dataset of Chennai Transport & AI Observations
const CHENNAI_INDICATIONS = [
  { id: 'ind-1', type: 'accident', title: 'Guindy Highway Junction', coordinates: [13.0067, 80.2206], severity: 'HIGH', busId: 'BUS-101', route: '21G', confidence: 96.4, details: 'Multi-vehicle traffic collision near Guindy flyover.' },
  { id: 'ind-2', type: 'waterlogging', title: 'Tambaram Main Road', coordinates: [12.9229, 80.1275], severity: 'HIGH', busId: 'BUS-204', route: '21G', confidence: 94.2, details: 'Severe 30cm waterlogging blocking bus lane.' },
  { id: 'ind-3', type: 'pothole', title: 'Anna Nagar Arch Node', coordinates: [13.0850, 80.2100], severity: 'MEDIUM', busId: 'BUS-205', route: '570', confidence: 89.5, details: 'Deep asphalt surface crack causing vehicle slowdown.' },
  { id: 'ind-4', type: 'accident', title: 'Koyambedu Roundabout', coordinates: [13.0694, 80.2030], severity: 'HIGH', busId: 'BUS-310', route: '91', confidence: 96.1, details: 'Overturned cargo vehicle blocking dual transit corridors.' },
  { id: 'ind-5', type: 'delay', title: 'T. Nagar Pondy Bazaar', coordinates: [13.0405, 80.2337], severity: 'HIGH', busId: 'BUS-105', route: '19', confidence: 91.0, details: 'Congestion delay +17 min due to peak commercial traffic.' },
  { id: 'ind-6', type: 'waterlogging', title: 'Velachery MRTS Highway', coordinates: [12.9780, 80.2180], severity: 'HIGH', busId: 'BUS-402', route: 'M45', confidence: 93.8, details: 'Monsoon water accumulation across south carriageway.' },
  { id: 'ind-7', type: 'safety', title: 'Adyar Lattice Bridge', coordinates: [13.0012, 80.2565], severity: 'HIGH', busId: 'BUS-102', route: '21G', confidence: 92.4, details: 'Unregulated pedestrian jaywalking across high-speed bus lane.' },
  { id: 'ind-8', type: 'pothole', title: 'Porur Junction (Mount-Poonamallee)', coordinates: [13.0350, 80.1580], severity: 'MEDIUM', busId: 'BUS-305', route: '70', confidence: 87.6, details: 'Severe road surface trenching near metro construction zone.' },
  { id: 'ind-9', type: 'delay', title: 'Vadapalani Metro Node', coordinates: [13.0500, 80.2120], severity: 'MEDIUM', busId: 'BUS-312', route: '70', confidence: 88.2, details: 'Signal phase delay creating +12 min headway gap.' },
  { id: 'ind-10', type: 'waterlogging', title: 'Chromepet Sub-Corridor', coordinates: [12.9510, 80.1410], severity: 'HIGH', busId: 'BUS-208', route: '21G', confidence: 95.0, details: 'Drainage overflow covering 40m road section.' },
  { id: 'ind-11', type: 'active_bus', title: 'MTC Bus #BUS-204 (Route 21G)', coordinates: [12.9280, 80.1340], severity: 'NORMAL', busId: 'BUS-204', route: '21G', speed: '24 km/h', details: 'Active transit unit operating on Tambaram-Central corridor.' },
  { id: 'ind-12', type: 'active_bus', title: 'MTC Bus #BUS-205 (Route 570)', coordinates: [13.0020, 80.2150], severity: 'NORMAL', busId: 'BUS-205', route: '570', speed: '32 km/h', details: 'Active express unit on Guindy-OMR corridor.' },
  { id: 'ind-13', type: 'active_bus', title: 'MTC Bus #BUS-310 (Route 91)', coordinates: [13.0610, 80.1980], severity: 'NORMAL', busId: 'BUS-310', route: '91', speed: '18 km/h', details: 'Active unit approaching Koyambedu interchange.' },
  { id: 'ind-14', type: 'active_bus', title: 'MTC Bus #BUS-105 (Route 19)', coordinates: [13.0780, 80.2600], severity: 'NORMAL', busId: 'BUS-105', route: '19', speed: '28 km/h', details: 'Active unit near Egmore railway interchange.' },
  { id: 'ind-15', type: 'active_bus', title: 'MTC Bus #BUS-501 (Route 570-OMR)', coordinates: [12.9600, 80.2420], severity: 'NORMAL', busId: 'BUS-501', route: '570', speed: '42 km/h', details: 'Express IT Corridor bus unit near Perungudi plaza.' }
];

// Helper to generate visually big, bold radar icons
function createBigMarkerIcon(type, isScenario = false) {
  let bgGradient = 'linear-gradient(135deg, #ef4444, #b91c1c)';
  let borderColor = '#f87171';
  let pulseColor = 'rgba(239, 68, 68, 0.45)';
  let iconSymbol = '🚨';
  let labelText = 'ACCIDENT';

  if (type === 'waterlogging') {
    bgGradient = 'linear-gradient(135deg, #0284c7, #1d4ed8)';
    borderColor = '#38bdf8';
    pulseColor = 'rgba(56, 189, 248, 0.45)';
    iconSymbol = '🌊';
    labelText = 'WATERLOG';
  } else if (type === 'pothole' || type === 'road_damage') {
    bgGradient = 'linear-gradient(135deg, #f59e0b, #d97706)';
    borderColor = '#fbbf24';
    pulseColor = 'rgba(245, 158, 11, 0.45)';
    iconSymbol = '🕳️';
    labelText = 'POTHOLE';
  } else if (type === 'delay') {
    bgGradient = 'linear-gradient(135deg, #ea580c, #c2410c)';
    borderColor = '#fdba74';
    pulseColor = 'rgba(234, 88, 12, 0.45)';
    iconSymbol = '⏱️';
    labelText = 'DELAY';
  } else if (type === 'active_bus') {
    bgGradient = 'linear-gradient(135deg, #10b981, #047857)';
    borderColor = '#34d399';
    pulseColor = 'rgba(16, 185, 129, 0.35)';
    iconSymbol = '🚌';
    labelText = 'MTC BUS';
  } else if (type === 'safety' || type === 'pedestrian_hazard') {
    bgGradient = 'linear-gradient(135deg, #8b5cf6, #6d28d9)';
    borderColor = '#c4b5fd';
    pulseColor = 'rgba(139, 92, 246, 0.45)';
    iconSymbol = '🚶';
    labelText = 'PEDESTRIAN';
  }

  const size = isScenario ? 46 : 38;
  const pulseSize = isScenario ? 68 : 54;
  const fontSize = isScenario ? 20 : 16;
  const borderWidth = isScenario ? '3px' : '2px';

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
      <!-- Outer Radar Pulsing Ring -->
      <div style="
        position: absolute;
        top: -${(pulseSize - size) / 2}px;
        left: -${(pulseSize - size) / 2}px;
        width: ${pulseSize}px;
        height: ${pulseSize}px;
        border-radius: 50%;
        background: ${pulseColor};
        animation: radarPulse 1.8s infinite ease-out;
        pointer-events: none;
      "></div>
      
      <!-- Prominent Marker Badge -->
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${bgGradient};
        border: ${borderWidth} solid ${borderColor};
        box-shadow: 0 4px 14px rgba(0,0,0,0.65), 0 0 14px ${borderColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${fontSize}px;
        z-index: 2;
      ">
        ${iconSymbol}
      </div>

      <!-- Tag Underneath -->
      <div style="
        position: absolute;
        bottom: -16px;
        white-space: nowrap;
        background: rgba(15, 23, 42, 0.95);
        color: #ffffff;
        font-family: monospace;
        font-weight: 800;
        font-size: 9px;
        padding: 1px 5px;
        border-radius: 4px;
        border: 1px solid ${borderColor};
        box-shadow: 0 2px 6px rgba(0,0,0,0.6);
        pointer-events: none;
        z-index: 3;
      ">
        ${labelText}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-big-leaflet-marker',
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

export default function CityMap() {
  const { mapMarkers, setSelectedAlert, alerts, selectedScenarioKey, scenarios, activeStage } = useCommandCenter();
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);
  const markerLayerGroup = useRef(null);

  const [activeFilter, setActiveFilter] = useState('All');
  const activeScenario = scenarios[selectedScenarioKey] || scenarios.waterlogging;

  const filters = [
    { label: 'All', value: 'All' },
    { label: 'Accident', value: 'accident' },
    { label: 'Waterlogging', value: 'waterlogging' },
    { label: 'Potholes', value: 'pothole' },
    { label: 'Bus Delay', value: 'delay' },
    { label: 'MTC Buses', value: 'active_bus' }
  ];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map centered in Chennai
    mapInstance.current = L.map(mapContainerRef.current, {
      center: [13.0067, 80.2206],
      zoom: 12,
      zoomControl: false
    });

    // Standard OpenStreetMap tiles (100% Free, NO API Key Required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    // Add Zoom Control to bottom right
    L.control.zoom({
      position: 'bottomright'
    }).addTo(mapInstance.current);

    // Create marker layer group
    markerLayerGroup.current = L.layerGroup().addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Pan / Fly to active scenario coordinates on selection or stage completion
  useEffect(() => {
    if (mapInstance.current && activeScenario && activeScenario.coordinates) {
      mapInstance.current.flyTo(activeScenario.coordinates, 13, { duration: 1.2 });
    }
  }, [selectedScenarioKey, activeStage, activeScenario]);

  // Update Markers when data or filter changes
  useEffect(() => {
    if (!mapInstance.current || !markerLayerGroup.current) return;

    // Clear previous markers
    markerLayerGroup.current.clearLayers();

    // 1. Add active demo scenario marker (Extra Big & Glowing)
    if (activeScenario && activeScenario.coordinates) {
      const scenarioIcon = createBigMarkerIcon(activeScenario.incidentType, true);
      const activeMarker = L.marker(activeScenario.coordinates, { icon: scenarioIcon });

      const popupContent = `
        <div class="map-popup-card p-3 bg-slate-950 text-white rounded-lg border border-purple-500/50 shadow-2xl">
          <div class="popup-header mb-2 flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span class="popup-type-tag font-bold text-xs text-purple-400 uppercase tracking-wider">🚨 ${activeScenario.incidentType.toUpperCase()}</span>
            <span class="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">${activeScenario.severity || 'HIGH'} SEVERITY</span>
          </div>
          <div class="popup-body space-y-1 text-xs">
            <h4 class="popup-title font-bold text-white text-sm text-cyan-300 mb-1">${activeScenario.location}</h4>
            <p><strong>Confidence:</strong> <span class="text-emerald-400 font-bold">${activeScenario.confidence}%</span></p>
            <p><strong>Severity:</strong> <span class="text-red-400 font-bold">${activeScenario.severity}</span></p>
            <p><strong>Bus ID:</strong> <span class="text-white font-mono">${activeScenario.busId}</span></p>
            <p><strong>Route:</strong> <span class="text-white">${activeScenario.route}</span></p>
            <p><strong>GPS:</strong> <span class="text-slate-400 font-mono">${activeScenario.coordinates[0].toFixed(4)}, ${activeScenario.coordinates[1].toFixed(4)}</span></p>
            <p><strong>Source:</strong> <span class="text-purple-300 font-semibold">Edge AI / YOLO</span></p>
            <p><strong>Status:</strong> <span class="text-emerald-400 font-bold">VERIFIED (${activeScenario.verificationBuses ? activeScenario.verificationBuses.length : 3} Buses)</span></p>
          </div>
        </div>
      `;

      activeMarker.bindPopup(popupContent, { maxWidth: 280, className: 'custom-leaflet-popup' });
      activeMarker.addTo(markerLayerGroup.current);
    }

    // 2. Combine backend map markers with local rich indication dataset
    const combinedMarkers = [...CHENNAI_INDICATIONS];
    if (mapMarkers && mapMarkers.length > 0) {
      mapMarkers.forEach(bm => {
        if (!combinedMarkers.some(c => c.id === bm.id || (bm.busId && c.busId === bm.busId))) {
          combinedMarkers.push(bm);
        }
      });
    }

    // Filter markers based on active selection
    const filteredMarkers = combinedMarkers.filter(marker => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'pothole') return marker.type === 'pothole' || marker.type === 'road_damage';
      return marker.type === activeFilter;
    });

    filteredMarkers.forEach(marker => {
      const customIcon = createBigMarkerIcon(marker.type, false);
      const leafletMarker = L.marker(marker.coordinates, { icon: customIcon });

      const popupContent = `
        <div class="map-popup-card p-3 bg-slate-950 text-white rounded-lg border border-slate-800 shadow-xl">
          <div class="popup-header mb-1.5 flex items-center justify-between border-b border-slate-800 pb-1">
            <span class="popup-type-tag font-bold text-xs text-purple-400 uppercase tracking-wider">${(marker.type || 'HAZARD').toUpperCase()}</span>
            <span class="text-[10px] font-bold text-slate-400">${marker.severity || 'ACTIVE'}</span>
          </div>
          <div class="popup-body space-y-1 text-xs">
            <h4 class="popup-title font-bold text-cyan-300 text-xs mb-1">${marker.title}</h4>
            {marker.busId && <p><strong>Bus Unit:</strong> <span class="font-mono text-white">${marker.busId} (${marker.route})</span></p>}
            ${marker.busId ? `<p><strong>Bus Unit:</strong> <span class="font-mono text-white">${marker.busId} (${marker.route || ''})</span></p>` : ''}
            ${marker.camera ? `<p><strong>Camera:</strong> <span class="font-mono text-white">${marker.camera}</span></p>` : ''}
            ${marker.gpsStatus ? `<p><strong>GPS:</strong> <span class="text-emerald-400 font-bold">${marker.gpsStatus}</span></p>` : ''}
            ${marker.edgeAiStatus ? `<p><strong>Edge AI:</strong> <span class="text-emerald-400 font-bold">${marker.edgeAiStatus}</span></p>` : ''}
            ${marker.confidence ? `<p><strong>Confidence:</strong> <span class="text-emerald-400 font-bold">${marker.confidence}%</span></p>` : ''}
            ${marker.details ? `<p class="text-slate-300 text-[11px] mt-1 italic">${marker.details}</p>` : ''}
            <p class="text-[10px] text-slate-400 mt-1">Source: ${marker.source === 'connected' ? 'Connected Mobile Unit' : 'Edge AI Telemetry Node'}</p>
          </div>
        </div>
      `;

      leafletMarker.bindPopup(popupContent, { maxWidth: 260, className: 'custom-leaflet-popup' });
      leafletMarker.addTo(markerLayerGroup.current);
    });

  }, [mapMarkers, activeFilter, activeScenario, activeStage]);

  return (
    <div className="card city-map-card bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">

      <div className="map-controls-header flex flex-wrap items-center justify-between mb-3 border-b border-slate-800 pb-2 gap-2">
        <div>
          <h3 className="card-title text-base font-bold text-white flex items-center gap-2">
            Chennai Live GIS Map
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
              15+ ACTIVE NODES
            </span>
          </h3>
          <span className="card-subtitle text-xs text-slate-400">
            Real-Time Transport Corridor Intelligence (OpenStreetMap)
          </span>
        </div>

        <div className="map-filter-chips flex flex-wrap items-center gap-1">
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`filter-chip text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all ${activeFilter === filter.value
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="leaflet-map-wrapper relative rounded-lg overflow-hidden border border-slate-800">
        <div ref={mapContainerRef} className="leaflet-map-element" style={{ height: '360px', width: '100%' }}></div>

        {/* Visual Map Legend */}
        <div className="map-legend-overlay absolute bottom-3 left-3 bg-slate-950/95 border border-slate-800 p-2 rounded-lg text-[11px] flex flex-wrap gap-3 text-slate-300 z-[1000] shadow-2xl">
          <div className="legend-item flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 border border-red-300"></span> Accident</div>
          <div className="legend-item flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-500 border border-sky-300"></span> Waterlog</div>
          <div className="legend-item flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300"></span> Pothole</div>
          <div className="legend-item flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-300"></span> Pedestrian</div>
          <div className="legend-item flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300"></span> MTC Bus</div>
        </div>
      </div>
    </div>
  );
}

