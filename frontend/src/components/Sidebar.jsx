import React, { useEffect, useState } from 'react';
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
  Bus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X
} from 'lucide-react';

const SIDEBAR_STORAGE_KEY = 'urban-eye-sidebar-collapsed';
const MOBILE_PRIMARY_ITEMS = ['Dashboard', 'Accident Risk', 'GIS Map', 'Reports'];

export default function Sidebar() {
  const { activePage, setActivePage, metrics } = useCommandCenter();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
    } catch {
      // Local storage may be unavailable in restricted browsers.
    }
  }, [collapsed]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

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

  const primaryItems = navItems.filter(item => MOBILE_PRIMARY_ITEMS.includes(item.id));
  const moreActive = !MOBILE_PRIMARY_ITEMS.includes(activePage);

  const handleNavigate = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <aside className={`app-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
        <div className="sidebar-brand">
          <img className="sidebar-logo-image" src="/logo.png" alt="URBAN EYE logo" />
          <div className="sidebar-brand-text">
            <span className="brand-name">URBAN EYE</span>
            <span className="brand-badge">PROTOTYPE</span>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(value => !value)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Modules</span>
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.label : undefined}
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

      <nav className="mobile-tabbar" aria-label="Primary navigation">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-tab ${activePage === item.id ? 'active' : ''}`}
              onClick={() => handleNavigate(item.id)}
            >
              <Icon size={18} />
              <span>{item.label === 'Accident Risk' ? 'Risk' : item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          className={`mobile-tab ${moreActive ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(true)}
        >
          <MoreHorizontal size={18} />
          <span>More</span>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-nav-sheet-head">
              <div>
                <span className="mobile-nav-kicker">URBAN EYE</span>
                <h3 className="mobile-nav-title">All modules</h3>
              </div>
              <button
                type="button"
                className="mobile-nav-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mobile-nav-grid">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`mobile-nav-tile ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => handleNavigate(item.id)}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mobile-sheet-fleet">
              <span><strong>{metrics.fleet.active}</strong> active</span>
              <span><strong>{metrics.fleet.onRoute}</strong> on route</span>
              <span><strong>{metrics.fleet.delayed}</strong> delayed</span>
              <span><strong>{metrics.fleet.idle}</strong> idle</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
