const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error('Health check API unavailable.');
  return res.json();
}

export async function fetchModelInfo() {
  const res = await fetch(`${BASE_URL}/api/model-info`);
  if (!res.ok) throw new Error('Model Info API unavailable.');
  return res.json();
}

export async function predictFrame(imageFile, confidenceThreshold = 0.60) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const res = await fetch(`${BASE_URL}/api/predict?confidence_threshold=${confidenceThreshold}`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Prediction request failed.');
  }
  return res.json();
}

export async function fetchEvents() {
  const res = await fetch(`${BASE_URL}/api/events`);
  if (!res.ok) throw new Error('Events API unavailable.');
  return res.json();
}

export async function fetchEventById(id) {
  const res = await fetch(`${BASE_URL}/api/events/${id}`);
  if (!res.ok) throw new Error('Event Detail API unavailable.');
  return res.json();
}

export async function fetchAlerts() {
  const res = await fetch(`${BASE_URL}/api/alerts`);
  if (!res.ok) throw new Error('Alerts API unavailable.');
  return res.json();
}

export async function fetchBuses() {
  const res = await fetch(`${BASE_URL}/api/buses`);
  if (!res.ok) throw new Error('Buses API unavailable.');
  return res.json();
}
export async function connectBus(bus) {
  const res = await fetch(`${BASE_URL}/api/buses/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bus)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Bus connection failed.');
  }
  return res.json();
}

export async function disconnectBus(busId) {
  const res = await fetch(`${BASE_URL}/api/buses/${encodeURIComponent(busId)}/disconnect`, { method: 'POST' });
  if (!res.ok) throw new Error('Bus disconnect failed.');
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${BASE_URL}/api/analytics`);
  if (!res.ok) throw new Error('Analytics API unavailable.');
  return res.json();
}

export async function fetchMapEvents() {
  const res = await fetch(`${BASE_URL}/api/map-events`);
  if (!res.ok) throw new Error('Map events API unavailable.');
  return res.json();
}

export async function triggerSimulationStep(step, scenario = 'waterlogging') {
  const res = await fetch(`${BASE_URL}/api/simulate?step=${step}&scenario=${encodeURIComponent(scenario)}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Simulation endpoint failed.');
  return res.json();
}
