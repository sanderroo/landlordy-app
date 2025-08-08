import React from 'react';
import { authService } from '../services/authService';
import { 
  Home, 
  Building2, 
  Users, 
  CreditCard, 
  MessageSquare, 
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'properties', label: 'Panden', icon: Building2 },
    { id: 'tenants', label: 'Huurders', icon: Users },
    { id: 'payments', label: 'Betalingen', icon: CreditCard },
    { id: 'messages', label: 'Berichten', icon: MessageSquare },
    { id: 'analytics', label: 'Analyses', icon: BarChart3 },
    { id: 'reminders', label: 'Herinneringen', icon: Bell },
    { id: 'settings', label: 'Instellingen', icon: Settings },
  ];

  const handleLogout = () => {
    if (confirm('Weet je zeker dat je wilt uitloggen?')) {
      authService.logout();
      window.location.reload();
    }
  };

  const currentUser = authService.getCurrentUser();

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-blue-400">Landlordy</h1>
          <span className="text-2xl">🤓💰</span>
        </div>
        <p className="text-slate-400 text-sm mt-1">Vastgoed Beheer</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Snelle Statistieken</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Totaal Panden</span>
              <span className="text-white font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Actieve Huurders</span>
              <span className="text-white font-medium">49</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Maandelijkse Omzet</span>
              <span className="text-green-400 font-medium">€83.800</span>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="mt-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold text-sm">Pro Abonnement</span>
            <span className="text-green-200 text-xs">Actief</span>
          </div>
          <div className="text-white text-xs">
            €20/maand • Verlengt op 15 feb
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-semibold">
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-slate-400 text-xs">{currentUser?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Uitloggen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;