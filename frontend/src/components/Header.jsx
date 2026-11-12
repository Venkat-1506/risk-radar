import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  User,
  Bell,
  CheckCheck,
  ChevronRight,
  Clock,
  Droplet,
  MapPin,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { useCommandCenter } from '../context/CommandCenterContext';

const READ_ALERTS_KEY = 'urban-eye-read-alerts';
const MAX_NOTIFICATIONS = 6;

const typeIcons = {
  accident: AlertTriangle,
  waterlogging: Droplet,
  delay: Clock,
  safety: ShieldAlert,
  pothole: AlertTriangle
};

const typePages = {
  accident: 'Accident Risk',
  pothole: 'Accident Risk',
  safety: 'Bus Safety',
  delay: 'Bus Delay',
  waterlogging: 'Waterlogging'
};

const toTimestamp = (value) => {
  if (!value) return 0;
  const direct = Date.parse(value);
  if (!Number.isNaN(direct)) return direct;
  const clock = Date.parse(`1970-01-01 ${value}`);
  return Number.isNaN(clock) ? 0 : clock;
};

const formatType = (value = 'incident') => value.replace(/_/g, ' ');

export default function Header() {
  const { alerts = [], setActivePage, setSelectedAlert } = useCommandCenter();
  const [time, setTime] = useState(new Date());
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = window.localStorage.getItem(READ_ALERTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const notificationRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(READ_ALERTS_KEY, JSON.stringify(readIds));
    } catch {
      // Local storage may be unavailable in restricted browsers.
    }
  }, [readIds]);

  useEffect(() => {
    if (!notificationsOpen) return undefined;

    const handlePointerDown = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setNotificationsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notificationsOpen]);

  const recentAlerts = useMemo(() => {
    return [...alerts]
      .sort((a, b) => toTimestamp(b.time || b.created_at) - toTimestamp(a.time || a.created_at))
      .slice(0, MAX_NOTIFICATIONS);
  }, [alerts]);

  const unreadCount = useMemo(() => {
    return recentAlerts.filter((item) => !readIds.includes(item.id)).length;
  }, [recentAlerts, readIds]);

  const openAlert = (alertItem) => {
    setReadIds((prev) => (prev.includes(alertItem.id) ? prev : [...prev, alertItem.id]));
    setNotificationsOpen(false);
    const type = alertItem.incident_type || alertItem.type;
    setActivePage(typePages[type] || 'Accident Risk');
    setSelectedAlert(alertItem);
  };

  const markAllRead = () => {
    setReadIds((prev) => [...new Set([...prev, ...recentAlerts.map((item) => item.id)])]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-container">
          <img className="header-logo-image" src="/logo.png" alt="URBAN EYE logo" />
          <div>
            <h1 className="logo-text">URBAN EYE</h1>
            <p className="logo-sub">Urban Telemetry Node</p>
          </div>
        </div>
      </div>

      <div className="header-center">
        <span className="subtitle-tagline">AI-Powered Mobile Urban Intelligence Platform</span>
      </div>

      <div className="header-right">
        <div className="live-status-pill">
          <span className="live-dot"></span>
          <span className="live-text">LIVE SYSTEM</span>
        </div>

        <div className="header-clock">
          <span className="clock-time">{formatTime(time)}</span>
          <span className="clock-date">{formatDate(time)}</span>
        </div>

        <div className="divider"></div>

        <div className="mtc-badge">
          <span className="mtc-label">MTC Control Center</span>
          <span className="mtc-sub">Chennai City</span>
        </div>

        <div className="notification-wrap" ref={notificationRef}>
          <button
            type="button"
            className={`notification-btn ${notificationsOpen ? 'is-open' : ''}`}
            onClick={() => setNotificationsOpen((value) => !value)}
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            aria-expanded={notificationsOpen}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {notificationsOpen && (
            <div className="notification-panel">
              <div className="notification-head">
                <div>
                  <span className="notification-kicker">Command Center</span>
                  <h3 className="notification-title">Recent alerts</h3>
                </div>
                <button
                  type="button"
                  className="notification-mark-read"
                  onClick={markAllRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              </div>

              <div className="notification-list">
                {recentAlerts.length === 0 && (
                  <p className="notification-empty">No alerts available yet.</p>
                )}

                {recentAlerts.map((alertItem) => {
                  const type = alertItem.incident_type || alertItem.type || 'incident';
                  const Icon = typeIcons[type] || AlertTriangle;
                  const isUnread = !readIds.includes(alertItem.id);
                  return (
                    <button
                      key={alertItem.id}
                      type="button"
                      className={`notification-item ${isUnread ? 'is-unread' : ''}`}
                      onClick={() => openAlert(alertItem)}
                    >
                      <span className={`notification-icon type-${type}`}>
                        <Icon size={16} />
                      </span>
                      <span className="notification-copy">
                        <span className="notification-item-top">
                          <span className="notification-item-title">{alertItem.title}</span>
                          <span className={`notification-severity severity-${(alertItem.severity || 'low').toLowerCase()}`}>
                            {alertItem.severity || 'LOW'}
                          </span>
                        </span>
                        <span className="notification-item-meta">
                          <MapPin size={11} />
                          <span className="notification-location">{alertItem.location}</span>
                          <span className="notification-dot-sep" />
                          <span>{alertItem.time || 'Just now'}</span>
                        </span>
                        <span className="notification-type-label">{formatType(type)}</span>
                      </span>
                      <ChevronRight size={14} className="notification-chevron" />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="notification-footer"
                onClick={() => {
                  setNotificationsOpen(false);
                  setActivePage('Dashboard');
                }}
              >
                Open full alert queue
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="user-profile">
          <div className="avatar-circle">
            <User size={16} />
          </div>
          <span className="user-name">MTC_Admin</span>
        </div>
      </div>
    </header>
  );
}
