import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const CommandCenterContext = createContext();

export const SCENARIOS = {
  waterlogging: {
    id: 'waterlogging',
    title: 'Scenario 1: Waterlogging Hazard',
    busId: 'BUS-204',
    route: 'Route 21G',
    location: 'Tambaram Main Road',
    coordinates: [12.9229, 80.1275],
    incidentType: 'waterlogging',
    severity: 'HIGH',
    sampleImage: '/assets/waterlog 1.jpeg',
    verificationBuses: ['BUS-204', 'BUS-205', 'BUS-310'],
    delayImpact: '+11 min',
    busesAffected: 8,
    speedDrop: '-42%',
    confidence: 94.2,
    inferenceMs: 182,
    correlationText: 'Waterlogging causes severe routing disruptions on Tambaram Main Road corridor.',
    recommendedAction: 'Dispatch drainage maintenance team & issue automated MTC rerouting alert.'
  },
  pothole: {
    id: 'pothole',
    title: 'Scenario 2: Pothole / Road Damage',
    busId: 'BUS-205',
    route: 'Route 570',
    location: 'Guindy Junction',
    coordinates: [13.0067, 80.2206],
    incidentType: 'pothole',
    severity: 'MEDIUM',
    sampleImage: '/assets/pithole.jpeg',
    verificationBuses: ['BUS-205', 'BUS-101', 'BUS-402'],
    delayImpact: '+8 min',
    busesAffected: 5,
    speedDrop: '-28%',
    confidence: 89.5,
    inferenceMs: 164,
    correlationText: 'Severe asphalt degradation causes localized traffic deceleration at Guindy node.',
    recommendedAction: 'Asphalt patch repair request sent to Chennai Corporation.'
  },
  accident: {
    id: 'accident',
    title: 'Scenario 3: Vehicle Collision / Accident',
    busId: 'BUS-310',
    route: 'Route 91',
    location: 'Koyambedu Roundabout',
    coordinates: [13.0694, 80.2030],
    incidentType: 'accident',
    severity: 'HIGH',
    sampleImage: '/assets/accident 1.jpeg',
    verificationBuses: ['BUS-310', 'BUS-305', 'BUS-401'],
    delayImpact: '+19 min',
    busesAffected: 12,
    speedDrop: '-65%',
    confidence: 96.1,
    inferenceMs: 210,
    correlationText: 'Multi-vehicle collision blocking dual lanes on Koyambedu corridor.',
    recommendedAction: 'Dispatch traffic police response team & emergency tow vehicle.'
  },
  pedestrian_hazard: {
    id: 'pedestrian_hazard',
    title: 'Scenario 4: Pedestrian Hazard',
    busId: 'BUS-105',
    route: 'Route 19',
    location: 'T. Nagar Junction',
    coordinates: [13.0405, 80.2337],
    incidentType: 'pedestrian_hazard',
    severity: 'HIGH',
    sampleImage: '/assets/pedestrians crossing road.jpeg',
    verificationBuses: ['BUS-105', 'BUS-204', 'BUS-101'],
    delayImpact: '+5 min',
    busesAffected: 4,
    speedDrop: '-35%',
    confidence: 92.4,
    inferenceMs: 175,
    correlationText: 'Unregulated pedestrian movement detected across high-speed bus corridor.',
    recommendedAction: 'Adjust signal timing & activate pedestrian warning beacons.'
  }
};

export const CommandCenterProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [alerts, setAlerts] = useState([]);
  const [metrics, setMetrics] = useState({
    accidentRiskZonesCount: 10,
    activeSafetyAlertsCount: 24,
    recurringDelayHotspotsCount: 6,
    persistentWaterloggingCount: 11,
    fleet: { active: 121, onRoute: 95, delayed: 15, idle: 11 },
    cross_event_insights: []
  });
  const [mapMarkers, setMapMarkers] = useState([]);
    const [connectedBuses, setConnectedBuses] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  // Model & System status
  const [modelAvailable, setModelAvailable] = useState(false);
  const [systemHealthy, setSystemHealthy] = useState(true);

  // 7-Stage Demo Simulation States
  const [simulationActive, setSimulationActive] = useState(false);
  const [selectedScenarioKey, setSelectedScenarioKey] = useState('waterlogging');
  const [activeStage, setActiveStage] = useState(0); // 0 = idle, 1..7 = active stage
  const [simStep, setSimStep] = useState(0);
  const [simLogs, setSimLogs] = useState([]);
  const [simActiveBuses, setSimActiveBuses] = useState([]);
  const [lastEventId, setLastEventId] = useState('EVT-INITIAL');

  // Camera stream feed state
  const [feedData, setFeedData] = useState({
    busId: 'BUS-204',
    route: 'Route 21G',
    location: 'Tambaram Main Road',
    coordinates: [12.9229, 80.1275],
    time: '09:44 AM',
    detection: 'WATERLOGGING DETECTED',
    confidence: 94.2,
    inferenceMs: 182,
    camera: 'FRONT CAMERA',
    status: 'EDGE AI ACTIVE',
    severity: 'HIGH',
    imagePath: '/assets/waterlog 1.jpeg'
  });

  // Pull all live data from backend SQLite DB
  const refreshDashboardData = async () => {
    try {
      const [alertsData, mapMarkersData, analyticsData, busesData] = await Promise.all([
        api.fetchAlerts(),
        api.fetchMapEvents(),
        api.fetchAnalytics(),
        api.fetchBuses()
      ]);

      setAlerts(alertsData);
      setMapMarkers(mapMarkersData);
      setMetrics(analyticsData);
      setConnectedBuses(busesData.filter(bus => bus.source === 'connected'));
    } catch (err) {
      console.error('Failed to load dashboard parameters from FastAPI:', err);
    }
  };

  // Perform initial system health check and model check on page load
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        const [health, modelInfo] = await Promise.all([
          api.fetchHealth(),
          api.fetchModelInfo()
        ]);
        setSystemHealthy(health.database === 'connected');
        setModelAvailable(true); // Mark AI model available for edge detection pipeline
      } catch (err) {
        console.error('FastAPI Connection error on startup:', err);
        setSystemHealthy(false);
      }
      
      // Load initial datasets
      await refreshDashboardData();
    };

    initializeSystem();
  }, []);

  // 7-STAGE AUTOMATIC DEMO MODE EXECUTION
  const runFullDemo = async (scenarioKey = selectedScenarioKey) => {
    if (simulationActive) return;

    const scenario = SCENARIOS[scenarioKey] || SCENARIOS.waterlogging;
    setSelectedScenarioKey(scenarioKey);
    setSimulationActive(true);
    setSimLogs([]);
    setSimActiveBuses([]);
    setActiveStage(1);
    setSimStep(0);

    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Step 0: Reset DB state on backend
    try {
      await api.triggerSimulationStep(0, scenarioKey);
    } catch (e) {
      console.warn('DB reset note:', e);
    }

    const stageTimeouts = [
      {
        stage: 1,
        name: 'BUS CAMERAS',
        action: async () => {
          setFeedData({
            busId: scenario.busId,
            route: scenario.route,
            location: scenario.location,
            coordinates: scenario.coordinates,
            time: nowStr,
            detection: 'Raw Camera Stream',
            confidence: null,
            inferenceMs: null,
            camera: 'FRONT CAMERA',
            status: 'CAMERA FRAME RECEIVED',
            severity: 'LOW',
            imagePath: scenario.sampleImage
          });
          setSimLogs(prev => [...prev, {
            time: nowStr,
            bus: scenario.busId,
            log: `STAGE 1 [BUS CAMERAS]: Mobile telemetry active on ${scenario.busId} (${scenario.route}). Camera frame received.`
          }]);
        }
      },
      {
        stage: 2,
        name: 'EDGE AI DETECTION',
        action: async () => {
          setModelAvailable(true);
          setFeedData(prev => ({
            ...prev,
            detection: `${scenario.incidentType.toUpperCase().replace('_', ' ')} DETECTED`,
            confidence: scenario.confidence || 94.2,
            severity: scenario.severity || 'HIGH',
            inferenceMs: scenario.inferenceMs || 182,
            status: '✓ INCIDENT DETECTED'
          }));
          setSimLogs(prev => [...prev, {
            time: nowStr,
            bus: scenario.busId,
            log: `STAGE 2 [EDGE AI]: YOLO inference evaluated frame. Detected ${scenario.incidentType} (Confidence: ${scenario.confidence}%, Latency: ${scenario.inferenceMs}ms).`
          }]);
        }
      },
      {
        stage: 3,
        name: 'GPS + TIMESTAMP',
        action: async () => {
          setSimActiveBuses([scenario.busId]);
          setSimLogs(prev => [...prev, {
            time: nowStr,
            bus: scenario.busId,
            log: `STAGE 3 [GPS + TIMESTAMP]: Spatial coordinates attached: [${scenario.coordinates.join(', ')}] - Tagged as DEMO TELEMETRY.`
          }]);
        }
      },
      {
        stage: 4,
        name: 'CENTRAL PLATFORM',
        action: async () => {
          // Ingest single observation into SQLite via FastAPI
          const res = await api.triggerSimulationStep(1, scenarioKey);
          setSimStep(1);
          setLastEventId(res.last_event_id || 'EVT-88A92B');
          await refreshDashboardData();

          setSimLogs(prev => [...prev, {
            time: nowStr,
            bus: scenario.busId,
            log: `STAGE 4 [CENTRAL PLATFORM]: Observation received and stored in SQLite database. EVENT ID: ${res.last_event_id || 'EVT-88A92B'}.`
          }]);
        }
      },
      {
        stage: 5,
        name: 'MULTI-BUS VERIFICATION',
        action: async () => {
          // Ingest remaining 3 simulated buses in 100m radius
          const res = await api.triggerSimulationStep(4, scenarioKey);
          setSimStep(4);
          setSimActiveBuses(scenario.verificationBuses);
          await refreshDashboardData();

          setSimLogs(prev => [...prev, {
            time: nowStr,
            bus: 'MULTI-BUS',
            log: `STAGE 5 [MULTI-BUS VERIFICATION]: 4 independent buses (${scenario.verificationBuses.join(', ')}) confirmed hazard at ${scenario.location} within 15m window. Reliability: VERIFIED / HIGH RELIABILITY.`
          }]);
        }
      },
      {
        stage: 6,
        name: 'PATTERN & CAUSE',
        action: async () => {
          setSimLogs(prev => [...prev, {
            time: nowStr,
            bus: 'AI-ENGINE',
            log: `STAGE 6 [PATTERN & CAUSE]: Correlation engine executed. Result: "${scenario.correlationText}"`
          }]);
        }
      },
      {
        stage: 7,
        name: 'ACTIONABLE ALERT',
        action: async () => {
          await refreshDashboardData();
          setSimLogs(prev => [...prev, {
            time: nowStr,
            bus: 'COMMAND-DISPATCH',
            log: `STAGE 7 [ACTIONABLE ALERT]: HIGH PRIORITY ALERT generated for ${scenario.location}. Published to Dashboard, Map, Alerts & Reports!`
          }]);
        }
      }
    ];

    // Execute stages sequentially with 1.8 second delays between stages
    for (let i = 0; i < stageTimeouts.length; i++) {
      const stageObj = stageTimeouts[i];
      setActiveStage(stageObj.stage);
      try {
        await stageObj.action();
      } catch (err) {
        console.error(`Error in demo stage ${stageObj.stage}:`, err);
      }
      await new Promise(resolve => setTimeout(resolve, 1800));
    }

    setSimulationActive(false);
  };

  const resetSimulation = async () => {
    try {
      setSimulationActive(true);
      await api.triggerSimulationStep(0, selectedScenarioKey);
      setSimulationActive(false);
      setSimStep(0);
      setActiveStage(0);
      setSimLogs([]);
      setSimActiveBuses([]);
      setFeedData({
        busId: 'BUS-204',
        route: 'Route 21G (Tambaram)',
        time: '09:44 AM',
        detection: 'Waterlogging Detected',
        confidence: null,
        camera: 'FRONT CAMERA',
        status: 'DEMO FEED',
        severity: 'MEDIUM',
        imagePath: '/data/demo_camera/waterlogging/sample1.jpg'
      });
      setSelectedAlert(null);
      await refreshDashboardData();
    } catch (err) {
      console.error('Failed to reset backend database state:', err);
      setSimulationActive(false);
    }
  };

  return (
    <CommandCenterContext.Provider
      value={{
        activePage,
        setActivePage,
        alerts,
        metrics,
        mapMarkers,
          connectedBuses,
        selectedAlert,
        setSelectedAlert,
        simulationActive,
        simStep,
        simLogs,
        simActiveBuses,
        selectedScenarioKey,
        setSelectedScenarioKey,
        activeStage,
        lastEventId,
        scenarios: SCENARIOS,
        runFullDemo,
        resetSimulation,
        feedData,
        modelAvailable,
        systemHealthy,
        refreshDashboardData
      }}
    >
      {children}
    </CommandCenterContext.Provider>
  );
};

export const useCommandCenter = () => useContext(CommandCenterContext);
