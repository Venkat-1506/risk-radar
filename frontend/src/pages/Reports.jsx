import React, { useState, useEffect } from 'react';
import { useCommandCenter } from '../context/CommandCenterContext';
import * as api from '../services/api';
import { FileText, Download, Filter, Search, Calendar } from 'lucide-react';

export default function Reports() {
  const { alerts } = useCommandCenter();
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [searchLocation, setSearchLocation] = useState('');

  const filteredReports = alerts.filter(rep => {
    const repType = rep.incident_type || rep.type || '';
    const repSeverity = rep.severity || '';
    const repLocation = rep.location || '';
    const repTitle = rep.title || '';
    const repDetails = rep.details || '';

    const matchType = filterType === 'All' || repType === filterType;
    const matchSeverity = filterSeverity === 'All' || repSeverity === filterSeverity;
    const matchLocation = repLocation.toLowerCase().includes(searchLocation.toLowerCase()) || 
                          repTitle.toLowerCase().includes(searchLocation.toLowerCase()) ||
                          repDetails.toLowerCase().includes(searchLocation.toLowerCase());
    return matchType && matchSeverity && matchLocation;
  });

  const handleDownloadCSV = () => {
    // Generate CSV output string
    let csvContent = "Report ID,Title,Category,Severity,Date/Time,Location,Observations Count,Buses List,Impact,Recommended Action\n";
    
    filteredReports.forEach(rep => {
      const id = rep.id || '';
      const title = `"${(rep.title || '').replace(/"/g, '""')}"`;
      const category = rep.incident_type || rep.type || '';
      const severity = rep.severity || '';
      const time = rep.time || '';
      const location = `"${(rep.location || '').replace(/"/g, '""')}"`;
      const observed = rep.buses_observed || rep.busesObserved || 1;
      const list = `"${(rep.buses_list || rep.busesList || '').replace(/"/g, '""')}"`;
      const impact = `"${(rep.impact || '').replace(/"/g, '""')}"`;
      const action = `"${(rep.recommended_action || rep.recommendedAction || '').replace(/"/g, '""')}"`;

      csvContent += `${id},${title},${category},${severity},${time},${location},${observed},${list},${impact},${action}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bus_sense_alerts_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredReports, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `bus_sense_alerts_report_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sub-page reports-page">
      <div className="sub-page-header border-purple-bottom">
        <div>
          <span className="sub-page-tag text-purple">OFFICIAL TRANSIT AUDITS</span>
          <h2 className="sub-page-title">Command Center Analytical Reports</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDownloadCSV} className="rdc-download-btn bg-slate-50 border-slate-300">
            <Download size={14} className="mr-1" /> Export CSV
          </button>
          <button onClick={handleDownloadJSON} className="rdc-download-btn bg-slate-50 border-slate-300">
            <Download size={14} className="mr-1" /> Export JSON
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="card filter-panel-card mt-3">
        <div className="flex-align-center mb-3">
          <Filter size={16} className="color-purple mr-1" />
          <h4 className="card-title">Filter Reports Archive</h4>
        </div>
        
        <div className="filter-form-grid">
          {/* Location search */}
          <div className="filter-input-group">
            <label className="filter-lbl">Search Term</label>
            <div className="input-search-wrapper">
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search location or keyword..." 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Event type */}
          <div className="filter-input-group">
            <label className="filter-lbl">Event Type</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              <option value="accident">Accident Risk</option>
              <option value="waterlogging">Waterlogging</option>
              <option value="delay">Bus Delay</option>
              <option value="safety">Bus Safety</option>
            </select>
          </div>

          {/* Severity */}
          <div className="filter-input-group">
            <label className="filter-lbl">Severity</label>
            <select 
              value={filterSeverity} 
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Severities</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          {/* Date mockup */}
          <div className="filter-input-group">
            <label className="filter-lbl">Audit Date</label>
            <div className="input-search-wrapper">
              <Calendar size={14} className="search-icon" />
              <input type="text" value="2026-08-28 (Today)" disabled className="search-input bg-slate-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="reports-dossier-grid mt-4">
        {filteredReports.map((rep) => {
          const type = rep.incident_type || rep.type || 'unknown';
          const busesObserved = rep.buses_observed || rep.busesObserved || 1;
          const busesList = rep.buses_list || rep.busesList || '';
          const recAction = rep.recommended_action || rep.recommendedAction || '';

          return (
            <div key={rep.id} className="card report-dossier-card">
              <div className="rdc-header">
                <div className="flex-align-center">
                  <FileText size={18} className="color-purple mr-1" />
                  <span className="rdc-id">ID: {rep.id}</span>
                </div>
                <span className={`badge-severity ${rep.severity === 'HIGH' ? 'badge-red' : 'badge-orange'}`}>
                  {rep.severity}
                </span>
              </div>

              <h3 className="rdc-title">{rep.title}</h3>
              
              <div className="rdc-dossier-sections mt-3">
                <div className="rdc-section">
                  <span className="rdc-label">SUMMARY</span>
                  <p className="rdc-val">{rep.details || rep.summary}</p>
                </div>

                <div className="rdc-section">
                  <span className="rdc-label">OBSERVATIONAL METRICS</span>
                  <p className="rdc-val">
                    Count: <strong>{busesObserved} observations</strong> · Unique buses: <strong>{busesList}</strong>
                  </p>
                </div>

                <div className="rdc-section">
                  <span className="rdc-label">TRANSIT IMPACT REPORT</span>
                  <p className="rdc-val text-red font-medium">{rep.impact}</p>
                </div>

                <div className="rdc-section">
                  <span className="rdc-label">RECOMMENDED INTERVENTION TASK</span>
                  <p className="rdc-val font-semibold bg-slate-50 p-2 rounded border border-slate-200 text-slate-800">
                    {recAction}
                  </p>
                </div>
              </div>

              <div className="rdc-footer mt-4">
                <span className="rdc-date">Published: {rep.time}</span>
              </div>
            </div>
          );
        })}

        {filteredReports.length === 0 && (
          <div className="card w-full text-center p-8 text-slate-400">
            No active matching records found in the database.
          </div>
        )}
      </div>
    </div>
  );
}
