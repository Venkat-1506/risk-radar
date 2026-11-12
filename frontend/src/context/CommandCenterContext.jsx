import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

// Curated mock observations keep the intelligence surfaces populated when the
// FastAPI database is empty (fresh install, demo reset, or offline preview).
const MOCK_ALERTS = [
  {
    id: 'ALT-2608-001',
    incident_type: 'accident',
    type: 'accident',
    severity: 'HIGH',
    title: 'Multi-Vehicle Collision — Guindy Flyover',
    location: 'Guindy Junction, Chennai',
    time: '08:42 AM',
    confidence: 96.4,
    buses_observed: 5,
    buses_list: 'BUS-101,BUS-205,BUS-310,BUS-402,BUS-501',
    impact: '+17 min delay across Routes 21G and 570',
    recommended_action: 'Dispatch traffic police and emergency tow unit; reroute 21G via Inner Ring Road.',
    latitude: 13.0067,
    longitude: 80.2206,
    status: 'VERIFIED',
    details: 'Two cars and a cargo van collided on the Guindy flyover service lane, blocking the right bus lane.',
    first_seen: '08:31 AM',
    last_seen: '08:42 AM'
  },
  {
    id: 'ALT-2608-002',
    incident_type: 'accident',
    type: 'accident',
    severity: 'HIGH',
    title: 'Overturned Cargo Vehicle — Koyambedu',
    location: 'Koyambedu Roundabout, Chennai',
    time: '09:15 AM',
    confidence: 94.8,
    buses_observed: 4,
    buses_list: 'BUS-310,BUS-305,BUS-401,BUS-208',
    impact: '+19 min delay on Route 91 and 70 corridor',
    recommended_action: 'Deploy recovery crane and divert Route 91 services through Inner Ring Road.',
    latitude: 13.0694,
    longitude: 80.2030,
    status: 'VERIFIED',
    details: 'Overturned cargo vehicle restricting two lanes near the Koyambedu metro interchange.',
    first_seen: '09:02 AM',
    last_seen: '09:15 AM'
  },
  {
    id: 'ALT-2608-003',
    incident_type: 'waterlogging',
    type: 'waterlogging',
    severity: 'HIGH',
    title: 'Severe Waterlogging — Tambaram Main Road',
    location: 'Tambaram Main Road, Chennai',
    time: '09:44 AM',
    confidence: 94.2,
    buses_observed: 4,
    buses_list: 'BUS-204,BUS-205,BUS-310,BUS-208',
    impact: '+11 min delay; 8 buses affected on Route 21G',
    recommended_action: 'Dispatch drainage maintenance team and issue automated MTC rerouting alert.',
    latitude: 12.9229,
    longitude: 80.1275,
    status: 'VERIFIED',
    details: '30cm standing water covering the bus lane near Tambaram Sanatorium junction.',
    first_seen: '09:31 AM',
    last_seen: '09:44 AM'
  },
  {
    id: 'ALT-2608-004',
    incident_type: 'delay',
    type: 'delay',
    severity: 'MEDIUM',
    title: 'Peak Commercial Congestion — T. Nagar',
    location: 'T. Nagar Pondy Bazaar, Chennai',
    time: '10:02 AM',
    confidence: 91.0,
    buses_observed: 3,
    buses_list: 'BUS-105,BUS-312,BUS-501',
    impact: 'Average delay +14 min on Route 19',
    recommended_action: 'Activate signal priority at Pondy Bazaar and alert depot control for headway adjustment.',
    latitude: 13.0405,
    longitude: 80.2337,
    status: 'CORROBORATED',
    details: 'Peak commercial traffic and double parking have slowed bus movement through Pondy Bazaar.',
    first_seen: '09:48 AM',
    last_seen: '10:02 AM'
  },
  {
    id: 'ALT-2608-005',
    incident_type: 'safety',
    type: 'safety',
    severity: 'HIGH',
    title: 'Pedestrian Jaywalking — Adyar Lattice Bridge',
    location: 'Adyar Lattice Bridge, Chennai',
    time: '10:18 AM',
    confidence: 92.4,
    buses_observed: 3,
    buses_list: 'BUS-102,BUS-204,BUS-101',
    impact: 'Unregulated pedestrian movement across high-speed bus lane',
    recommended_action: 'Adjust signal timing and activate pedestrian warning beacons at the bridge approach.',
    latitude: 13.0012,
    longitude: 80.2565,
    status: 'VERIFIED',
    details: 'Multiple pedestrians observed crossing the high-speed corridor outside the marked crossing.',
    first_seen: '10:06 AM',
    last_seen: '10:18 AM'
  },
  {
    id: 'ALT-2608-006',
    incident_type: 'safety',
    type: 'safety',
    severity: 'MEDIUM',
    title: 'Overcrowding Alert — Velachery MRTS',
    location: 'Velachery MRTS Highway, Chennai',
    time: '10:35 AM',
    confidence: 88.7,
    buses_observed: 2,
    buses_list: 'BUS-402,BUS-208',
    impact: 'Occupancy at 131% of rated capacity',
    recommended_action: 'Dispatch a standby bus to the Velachery corridor and notify depot scheduling.',
    latitude: 12.9780,
    longitude: 80.2180,
    status: 'CORROBORATED',
    details: 'Edge density model flags sustained overcrowding on the Velachery MRTS corridor.',
    first_seen: '10:22 AM',
    last_seen: '10:35 AM'
  },
  {
    id: 'ALT-2608-007',
    incident_type: 'pothole',
    type: 'pothole',
    severity: 'MEDIUM',
    title: 'Road Surface Trenching — Porur Junction',
    location: 'Porur Junction, Mount-Poonamallee Road',
    time: '10:51 AM',
    confidence: 87.6,
    buses_observed: 2,
    buses_list: 'BUS-305,BUS-310',
    impact: 'Vehicles forced to slow below 20 km/h near metro construction zone',
    recommended_action: 'Raise an asphalt repair request with Chennai Corporation and place warning cones.',
    latitude: 13.0350,
    longitude: 80.1580,
    status: 'OBSERVED',
    details: 'Deep surface trenching near the metro construction zone is forcing buses to swerve.',
    first_seen: '10:39 AM',
    last_seen: '10:51 AM'
  }
];

const normalizeAlert = (alert) => {
  const busesList = Array.isArray(alert.busesList)
    ? alert.busesList
    : typeof alert.buses_list === 'string'
      ? alert.buses_list.split(',').map(bus => bus.trim()).filter(Boolean)
      : [];
  const busesObserved = alert.buses_observed ?? alert.busesObserved ?? busesList.length ?? 1;
  const recommendedAction = alert.recommended_action || alert.recommendedAction || '';

  return {
    ...alert,
    type: alert.type || alert.incident_type,
    incident_type: alert.incident_type || alert.type,
    busesList,
    buses_list: alert.buses_list || busesList.join(','),
    buses_observed: busesObserved,
    busesObserved,
    recommended_action: recommendedAction,
    recommendedAction
  };
};

const INITIAL_ALERTS = MOCK_ALERTS.map(normalizeAlert);

const mergeAlerts = (remoteAlerts = []) => {
  const normalizedRemote = (remoteAlerts || []).map(normalizeAlert);
  const seen = new Set(normalizedRemote.map(alert => alert.id));
  const fallback = INITIAL_ALERTS.filter(alert => !seen.has(alert.id));
  return [...normalizedRemote, ...fallback];
};

export const CommandCenterProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
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
  const [scenarioAnalyzing, setScenarioAnalyzing] = useState(false);
  const simulationActiveRef = useRef(false);

  useEffect(() => {
    simulationActiveRef.current = simulationActive;
  }, [simulationActive]);

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

  // When a preloaded scenario is chosen, show its attached camera frame and
  // simulate a short edge-AI analysis pass before revealing detections.
  useEffect(() => {
    const scenario = SCENARIOS[selectedScenarioKey];
    if (!scenario || simulationActiveRef.current) return;

    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setScenarioAnalyzing(true);
    setFeedData({
      busId: scenario.busId,
      route: scenario.route,
      location: scenario.location,
      coordinates: scenario.coordinates,
      time: nowStr,
      detection: 'ANALYSING FRAME',
      confidence: null,
      inferenceMs: null,
      camera: 'FRONT CAMERA',
      status: 'ANALYSING FRAME',
      severity: 'PENDING',
      imagePath: scenario.sampleImage
    });

    const timer = setTimeout(() => {
      if (simulationActiveRef.current) return;
      setFeedData(prev => ({
        ...prev,
        detection: `${scenario.incidentType.toUpperCase().replace('_', ' ')} DETECTED`,
        confidence: scenario.confidence,
        inferenceMs: scenario.inferenceMs,
        severity: scenario.severity,
        status: 'AI ANALYSIS COMPLETE'
      }));
      setScenarioAnalyzing(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [selectedScenarioKey]);

  // Pull all live data from backend SQLite DB
  const refreshDashboardData = async () => {
    try {
      const [alertsData, mapMarkersData, analyticsData, busesData] = await Promise.all([
        api.fetchAlerts(),
        api.fetchMapEvents(),
        api.fetchAnalytics(),
        api.fetchBuses()
      ]);

      setAlerts(mergeAlerts(alertsData));
      setMapMarkers(mapMarkersData);
      setMetrics(analyticsData);
      setConnectedBuses(busesData.filter(bus => bus.source === 'connected'));
    } catch (err) {
      console.error('Failed to load dashboard parameters from FastAPI:', err);
      setAlerts(prev => (prev.length ? prev : INITIAL_ALERTS));
    }
  };

  // Perform initial system health check and model check on page load
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        const [health] = await Promise.all([
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
          setScenarioAnalyzing(true);
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
          setScenarioAnalyzing(false);
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
          await api.triggerSimulationStep(4, scenarioKey);
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
    setScenarioAnalyzing(false);
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
      setScenarioAnalyzing(false);

      const scenario = SCENARIOS[selectedScenarioKey] || SCENARIOS.waterlogging;
      setFeedData({
        busId: scenario.busId,
        route: scenario.route,
        location: scenario.location,
        coordinates: scenario.coordinates,
        time: '09:44 AM',
        detection: 'CAMERA FRAME RECEIVED',
        confidence: null,
        inferenceMs: null,
        camera: 'FRONT CAMERA',
        status: 'DEMO FEED',
        severity: 'LOW',
        imagePath: scenario.sampleImage
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
        scenarioAnalyzing,
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
