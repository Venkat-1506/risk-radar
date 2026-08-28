import React, { useState } from 'react';
import { Bus, CheckCircle2, Circle, MapPin, Radio, ShieldCheck, Wifi, XCircle } from 'lucide-react';
import { useCommandCenter } from '../context/CommandCenterContext';
import * as api from '../services/api';

const locations = [
  'Tambaram Main Road',
  'Guindy Junction',
  'Koyambedu Roundabout',
  'Anna Nagar',
  'T. Nagar',
  'Velachery'
];

const initialForm = {
  bus_id: '',
  registration_number: '',
  route: '',
  camera_node: '',
  location: ''
};

export default function ConnectBus() {
  const { connectedBuses, refreshDashboardData } = useCommandCenter();
  const [form, setForm] = useState(initialForm);
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');

  const updateField = (event) => {
    setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleConnect = async (event) => {
    event.preventDefault();
    setError('');
    setMessage(null);
    setConnecting(true);
    try {
      const result = await api.connectBus(form);
      if (!result.success) {
        setError(result.error === 'Bus ID already connected' ? 'Bus ID already connected.' : result.error);
        return;
      }
      setMessage(result.bus);
      setForm(initialForm);
      await refreshDashboardData();
    } catch (err) {
      setError(err.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (busId) => {
    try {
      await api.disconnectBus(busId);
      await refreshDashboardData();
      if (message?.bus_id === busId) setMessage(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="sub-page connect-bus-page">
      <div className="sub-page-header border-purple-bottom">
        <div>
          <span className="sub-page-tag text-purple">MOBILE TELEMETRY NETWORK</span>
          <h2 className="sub-page-title">Connect New Bus</h2>
          <p className="connect-bus-subtitle">Register a mobile bus telemetry unit and connect its camera, GPS and Edge AI node to URBAN EYE.</p>
        </div>
      </div>

      <div className="connect-bus-grid">
        <section className="card connect-form-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Register Mobile Unit</h3>
              <span className="card-subtitle">Add a camera and GPS-equipped MTC bus</span>
            </div>
            <Bus size={24} className="connect-bus-icon" />
          </div>
          <form onSubmit={handleConnect} className="connect-form">
            <label>Bus ID<input name="bus_id" value={form.bus_id} onChange={updateField} placeholder="BUS-501" required /></label>
            <label>Registration Number<input name="registration_number" value={form.registration_number} onChange={updateField} placeholder="TN 01 AB 1234" required /></label>
            <label>Route<input name="route" value={form.route} onChange={updateField} placeholder="21G" required /></label>
            <label>Camera Node ID<input name="camera_node" value={form.camera_node} onChange={updateField} placeholder="CAM-BUS-501" required /></label>
            <label>GPS / Operating Location<select name="location" value={form.location} onChange={updateField} required><option value="">Select demo location</option>{locations.map(location => <option key={location} value={location}>{location}</option>)}</select></label>
            <label>Initial Status<input value="ACTIVE" readOnly /></label>
            {error && <p className="connect-error"><XCircle size={16} />{error}</p>}
            <button className="primary-btn-brand connect-submit" type="submit" disabled={connecting}>{connecting ? 'CONNECTING MOBILE UNIT...' : 'CONNECT BUS'}</button>
          </form>
        </section>

        <section className="card mobile-status-card">
          <h3 className="card-title">Mobile Unit Status</h3>
          <span className="card-subtitle">Central platform readiness</span>
          <div className="mobile-status-list">
            <StatusRow icon={Wifi} label="Network" value="CONNECTED" active />
            <StatusRow icon={MapPin} label="GPS" value="CONNECTED" active />
            <StatusRow icon={Radio} label="Camera" value="CONNECTED" active />
            <StatusRow icon={ShieldCheck} label="Edge AI" value="READY" active />
          </div>
          <div className="connection-story"><Bus size={18} /><span>BUS</span><b>+</b><Radio size={18} /><span>CAMERA</span><b>+</b><MapPin size={18} /><span>GPS</span><b>+</b><ShieldCheck size={18} /><span>EDGE AI</span></div>
        </section>
      </div>

      {message && <section className="connection-success"><CheckCircle2 size={24} /><div><strong>BUS CONNECTED SUCCESSFULLY</strong><span>{message.bus_id} | Route {message.route} | Camera {message.camera_node} | GPS: {message.location} | Status: ACTIVE</span><small>Edge AI Ready - Model Pending</small></div></section>}

      <section className="card connected-units-card">
        <div className="card-header-row"><div><h3 className="card-title">Connected Mobile Units</h3><span className="card-subtitle">Process-local telemetry registrations</span></div><span className="badge badge-intel">{connectedBuses.length} CONNECTED</span></div>
        <div className="connected-table-wrap">
          <table className="official-table"><thead><tr><th>Bus ID</th><th>Route</th><th>Camera</th><th>GPS</th><th>Edge AI</th><th>Status</th><th></th></tr></thead><tbody>
            {connectedBuses.length === 0 ? <tr><td colSpan="7" className="empty-connected">No mobile units connected yet.</td></tr> : connectedBuses.map(bus => <tr key={bus.bus_id}><td className="font-semibold">{bus.bus_id}</td><td>{bus.route}</td><td>{bus.camera_node}</td><td><span className="unit-state">{bus.gps_status}</span></td><td><span className="unit-state">{bus.edge_ai_status}</span></td><td><span className={bus.status === 'ACTIVE' ? 'status-active' : 'status-disconnected'}><Circle size={9} fill="currentColor" /> {bus.status}</span></td><td><button className="disconnect-btn" onClick={() => handleDisconnect(bus.bus_id)} disabled={bus.status !== 'ACTIVE'}>DISCONNECT</button></td></tr>)}
          </tbody></table>
        </div>
      </section>
    </div>
  );
}

function StatusRow({ icon: Icon, label, value, active }) {
  return <div className="mobile-status-row"><span><Icon size={16} />{label}</span><strong className={active ? 'status-active' : 'status-disconnected'}><Circle size={9} fill="currentColor" /> {value}</strong></div>;
}
