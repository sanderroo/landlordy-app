import React, { useState } from 'react';
import { 
  DollarSign, 
  Building2, 
  Users, 
  AlertCircle,
  TrendingUp,
  Calendar,
  MessageSquare,
  CheckCircle,
  CreditCard,
  Settings,
  X
} from 'lucide-react';
import { mockProperties, mockTenants, mockPayments } from '../data/mockData';

const Dashboard: React.FC = () => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Calculate dashboard metrics
  const totalProperties = mockProperties.length;
  const totalUnits = mockProperties.reduce((sum, prop) => sum + prop.totalUnits, 0);
  const occupiedUnits = mockProperties.reduce((sum, prop) => sum + prop.occupiedUnits, 0);
  const totalRevenue = mockProperties.reduce((sum, prop) => sum + prop.monthlyRevenue, 0);
  const occupancyRate = (occupiedUnits / totalUnits) * 100;

  const paidPayments = mockPayments.filter(p => p.status === 'paid').length;
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
  const overduePayments = mockPayments.filter(p => p.status === 'overdue').length;

  const recentPayments = mockPayments.slice(0, 5);

  const handleManageSubscription = () => {
    setShowSubscriptionModal(true);
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  const handleCancelSubscription = () => {
    if (confirm('Weet je zeker dat je je abonnement wilt opzeggen?')) {
      alert('Abonnement opgezegd. Je kunt de app gebruiken tot het einde van je huidige periode.');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overzicht van je huurpanden en betalingen</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Totale Omzet</p>
              <p className="text-3xl font-bold text-green-600">€{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+12,5% t.o.v. vorige maand</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Panden</p>
              <p className="text-3xl font-bold text-blue-600">{totalProperties}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">{totalUnits} totaal eenheden</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Bezettingsgraad</p>
              <p className="text-3xl font-bold text-purple-600">{occupancyRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">{occupiedUnits} van {totalUnits} bezet</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Achterstallige Betalingen</p>
              <p className="text-3xl font-bold text-red-600">{overduePayments}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Vereist aandacht</span>
          </div>
        </div>
      </div>

      {/* Payment Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Payment Status Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Betalingsstatus</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium text-green-800">Betaald</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{paidPayments}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-yellow-600 mr-3" />
                  <span className="font-medium text-yellow-800">In Behandeling</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{pendingPayments}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <span className="font-medium text-red-800">Achterstallig</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{overduePayments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recente Betalingen</h2>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Bekijk Alles</button>
            </div>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-semibold text-sm">
                        {payment.tenantName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.tenantName}</p>
                      <p className="text-sm text-gray-600">{payment.propertyName} - {payment.unitNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">€{payment.amount.toLocaleString()}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status === 'paid' ? 'Betaald' : payment.status === 'pending' ? 'In behandeling' : 'Achterstallig'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Properties Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Panden Overzicht</h2>
        
        {/* Connection Status Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">WhatsApp Verbonden</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">Tikkie Verbonden</span>
              </div>
            </div>
            <span className="text-sm text-gray-600">Alle systemen operationeel</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property) => (
            <div key={property.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">{property.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{property.address}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bezetting</span>
                  <span className="text-sm font-medium">{property.occupiedUnits}/{property.totalUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Maandelijkse Omzet</span>
                  <span className="text-sm font-medium text-green-600">€{property.monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(property.occupiedUnits / property.totalUnits) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Management */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded flex items-center justify-center mr-2">
                <span className="text-sm">🏠</span>
              </div>
              <h2 className="text-xl font-semibold">Landlordy Pro Abonnement</h2>
            </div>
            <p className="text-blue-100 mb-4">€20 per maand • Onbeperkte panden en huurders</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Automatische Tikkie links
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                WhatsApp integratie
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Uitgebreide analyses
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleManageSubscription}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <Settings className="w-5 h-5" />
              <span>Beheer Abonnement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Management Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Abonnement Beheren</h3>
              <button 
                onClick={() => setShowSubscriptionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">HuurBeheer Pro</span>
                  <span className="text-green-600 font-bold">€20/maand</span>
                </div>
                <p className="text-sm text-green-700">Actief sinds 15 januari 2024</p>
                <p className="text-sm text-green-700">Volgende betaling: 15 februari 2024</p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                  Betalingsgegevens Wijzigen
                </button>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                  Factuurgeschiedenis
                </button>
                <button 
                  onClick={handleCancelSubscription}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Abonnement Opzeggen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;