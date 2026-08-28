import React, { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

        <button className="icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="badge-dot"></span>
        </button>

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
