import React from 'react';
import { CommandCenterProvider, useCommandCenter } from './context/CommandCenterContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import AccidentRisk from './pages/AccidentRisk';
import BusSafety from './pages/BusSafety';
import BusDelay from './pages/BusDelay';
import Waterlogging from './pages/Waterlogging';
import GisMap from './pages/GisMap';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ConnectBus from './pages/ConnectBus';

function MainAppLayout() {
  const { activePage } = useCommandCenter();

  // Simple route selector
  const renderActivePage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardHome />;
      case 'Accident Risk':
        return <AccidentRisk />;
      case 'Bus Safety':
        return <BusSafety />;
      case 'Bus Delay':
        return <BusDelay />;
      case 'Waterlogging':
        return <Waterlogging />;
      case 'GIS Map':
        return <GisMap />;
      case 'Reports':
        return <Reports />;
      case 'Analytics':
        return <Analytics />;
      case 'Settings':
        return <Settings />;
      case 'Connect Bus':
        return <ConnectBus />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content-area">
        <Header />
        <main className="page-scroll-container">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CommandCenterProvider>
      <MainAppLayout />
    </CommandCenterProvider>
  );
}
