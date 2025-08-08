import React, { useState } from 'react';
import AuthWrapper from './components/Auth/AuthWrapper';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Properties from './components/Properties';
import Tenants from './components/Tenants';
import Payments from './components/Payments';
import Messages from './components/Messages';
import Analytics from './components/Analytics';
import Reminders from './components/Reminders';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'properties':
        return <Properties />;
      case 'tenants':
        return <Tenants />;
      case 'payments':
        return <Payments />;
      case 'messages':
        return <Messages />;
      case 'analytics':
        return <Analytics />;
      case 'reminders':
        return <Reminders />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-auto">
          {renderActiveComponent()}
        </div>
      </div>
    </AuthWrapper>
  );
}

export default App;