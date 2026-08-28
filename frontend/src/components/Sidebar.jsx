import React from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Droplet, 
  Map, 
  FileText, 
  BarChart3, 
  Settings,
  Bus
} from 'lucide-react';

export default function Sidebar() {
  const { activePage, setActivePage, metrics } = useCommandCenter();

  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Accident Risk', label: 'Accident Risk', icon: ShieldAlert },
    { id: 'Bus Safety', label: 'Bus Safety', icon: ShieldCheck },
    { id: 'Bus Delay', label: 'Bus Delay', icon: Clock },
    { id: 'Waterlogging', label: 'Waterlogging', icon: Droplet },
    { id: 'GIS Map', label: 'GIS Map', icon: Map },
    { id: 'Connect Bus', label: 'Connect Bus', icon: Bus },
    { id: 'Reports', label: 'Reports', icon: FileText },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'Settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <img className="sidebar-logo-image" src="/logo.png" alt="URBAN EYE logo" />
        <div>
          <span className="brand-name">URBAN EYE</span>
          <span className="brand-badge">PROTOTYPE</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActivePage(item.id)}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <h4 className="footer-title">FLEET STATUS</h4>
        <div className="fleet-stats">
          <div className="stat-row">
            <span className="dot dot-active"></span>
            <span className="stat-label">Active Buses:</span>
            <span className="stat-val">{metrics.fleet.active}</span>
          </div>
          <div className="stat-row">
            <span className="dot dot-route"></span>
            <span className="stat-label">On Route:</span>
            <span className="stat-val">{metrics.fleet.onRoute}</span>
          </div>
          <div className="stat-row">
            <span className="dot dot-delay"></span>
            <span className="stat-label">Delayed:</span>
            <span className="stat-val">{metrics.fleet.delayed}</span>
          </div>
          <div className="stat-row">
            <span className="dot dot-idle"></span>
            <span className="stat-label">Idle:</span>
            <span className="stat-val">{metrics.fleet.idle}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
