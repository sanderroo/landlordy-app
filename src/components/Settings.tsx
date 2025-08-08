import React from 'react';
import { useState } from 'react';
import { 
  User, 
  Bell, 
  MessageSquare, 
  CreditCard, 
  Shield, 
  Globe,
  Phone,
  Mail,
  Calendar,
  RotateCcw
} from 'lucide-react';
import { tikkieService } from '../services/tikkieService';
import OnboardingFlow from './Onboarding/OnboardingFlow';

const Settings: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(true);
  const [tikkieConnected, setTikkieConnected] = useState(true);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [showTikkieModal, setShowTikkieModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Landlord',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    whatsappPhone: '+31 6 12345678',
    whatsappToken: 'whatsapp_demo_token_123',
    tikkieApiKey: 'tikkie_demo_api_key_456',
    tikkieAppToken: 'tikkie_demo_app_token_789',
    defaultPaymentDay: '1',
    defaultPaymentTime: '09:00',
    daysBeforePayment: '3',
    lateFee: '50',
    gracePeriod: '5'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    alert('Profile updated successfully!');
  };

  const handleConnectWhatsApp = async () => {
    setIsConnecting(true);
    try {
      const result = await tikkieService.testWhatsAppConnection(
        formData.whatsappPhone,
        formData.whatsappToken
      );
      if (result.success) {
        setWhatsappConnected(true);
        setShowWhatsappModal(false);
        alert('WhatsApp connected successfully!');
      }
    } catch (error) {
      alert('Failed to connect WhatsApp. Please check your credentials.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectTikkie = async () => {
    setIsConnecting(true);
    try {
      const result = await tikkieService.testTikkieConnection();
      if (result.success) {
        setTikkieConnected(true);
        setShowTikkieModal(false);
        alert('Tikkie connected successfully!');
      }
    } catch (error) {
      alert('Failed to connect Tikkie. Please check your credentials.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTestWhatsApp = async () => {
    setIsConnecting(true);
    try {
      const result = await tikkieService.testWhatsAppConnection(
        formData.whatsappPhone,
        formData.whatsappToken
      );
      alert(result.success ? 'WhatsApp connection test successful!' : 'WhatsApp connection test failed!');
    } catch (error) {
      alert('WhatsApp connection test failed!');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTestTikkie = async () => {
    setIsConnecting(true);
    try {
      const result = await tikkieService.testTikkieConnection();
      alert(result.success ? 'Tikkie connection test successful!' : 'Tikkie connection test failed!');
    } catch (error) {
      alert('Tikkie connection test failed!');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRestartOnboarding = () => {
    localStorage.removeItem('landlordy_onboarding_completed');
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('landlordy_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button 
              onClick={handleSaveProfile}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>

          {/* WhatsApp Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">WhatsApp Integration</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                <div>
                  <p className="font-medium text-gray-900">WhatsApp Business Account</p>
                  <p className="text-sm text-gray-600">Connect your WhatsApp Business account to send automated messages</p>
                </div>
                <button 
                  onClick={() => setShowWhatsappModal(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    whatsappConnected 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {whatsappConnected ? 'Reconfigure' : 'Connect WhatsApp'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Business Account</label>
                <input
                  type="text"
                  placeholder="+1 (555) 123-4567"
                  value={formData.whatsappPhone}
                  onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Token</label>
                <input
                  type="password"
                  placeholder="Enter your WhatsApp API token"
                  value={formData.whatsappToken}
                  onChange={(e) => handleInputChange('whatsappToken', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className={`flex items-center justify-between p-4 rounded-lg ${
                whatsappConnected ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div>
                  <p className={`font-medium ${whatsappConnected ? 'text-green-800' : 'text-red-800'}`}>
                    Connection Status
                  </p>
                  <p className={`text-sm ${whatsappConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {whatsappConnected ? 'Connected and active' : 'Not connected'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${whatsappConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <button 
                    onClick={handleTestWhatsApp}
                    disabled={isConnecting}
                    className={`text-sm font-medium ${
                      whatsappConnected 
                        ? 'text-green-700 hover:text-green-900' 
                        : 'text-red-700 hover:text-red-900'
                    } disabled:opacity-50`}
                  >
                    Test Connection
                  </button>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Create a WhatsApp Business account</li>
                  <li>Apply for WhatsApp Business API access</li>
                  <li>Get your API token from the WhatsApp Business dashboard</li>
                  <li>Enter your phone number and API token above</li>
                  <li>Test the connection to ensure messages can be sent</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Payment Schedule Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Payment Schedule</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Payment Day</label>
                <select 
                  value={formData.defaultPaymentDay}
                  onChange={(e) => handleInputChange('defaultPaymentDay', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">1st of month</option>
                  <option value="5">5th of month</option>
                  <option value="10">10th of month</option>
                  <option value="15">15th of month</option>
                  <option value="20">20th of month</option>
                  <option value="25">25th of month</option>
                  <option value="30">30th of month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Payment Time</label>
                <input
                  type="time"
                  value={formData.defaultPaymentTime}
                  onChange={(e) => handleInputChange('defaultPaymentTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Days Before Payment Day</label>
                <input
                  type="number"
                  value={formData.daysBeforePayment}
                  onChange={(e) => handleInputChange('daysBeforePayment', e.target.value)}
                  min="1"
                  max="30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">How many days before the payment day should the Tikkie link be sent</p>
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <CreditCard className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Payment Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                <div>
                  <p className="font-medium text-gray-900">Tikkie Account</p>
                  <p className="text-sm text-gray-600">Connect your Tikkie account to create payment requests</p>
                </div>
                <button 
                  onClick={() => setShowTikkieModal(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    tikkieConnected 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {tikkieConnected ? 'Reconfigure' : 'Connect Tikkie'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tikkie API Key</label>
                <input
                  type="password"
                  placeholder="Enter your Tikkie API key"
                  value={formData.tikkieApiKey}
                  onChange={(e) => handleInputChange('tikkieApiKey', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tikkie App Token</label>
                <input
                  type="password"
                  placeholder="Enter your Tikkie app token"
                  value={formData.tikkieAppToken}
                  onChange={(e) => handleInputChange('tikkieAppToken', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className={`flex items-center justify-between p-4 rounded-lg ${
                tikkieConnected ? 'bg-blue-50' : 'bg-red-50'
              }`}>
                <div>
                  <p className={`font-medium ${tikkieConnected ? 'text-blue-800' : 'text-red-800'}`}>
                    Tikkie Integration
                  </p>
                  <p className={`text-sm ${tikkieConnected ? 'text-blue-600' : 'text-red-600'}`}>
                    {tikkieConnected ? 'Connected and ready to send payment links' : 'Not connected'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${tikkieConnected ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                  <button 
                    onClick={handleTestTikkie}
                    disabled={isConnecting}
                    className={`text-sm font-medium ${
                      tikkieConnected 
                        ? 'text-blue-700 hover:text-blue-900' 
                        : 'text-red-700 hover:text-red-900'
                    } disabled:opacity-50`}
                  >
                    Test Connection
                  </button>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">Setup Instructions</h4>
                <ol className="text-sm text-orange-800 space-y-1 list-decimal list-inside">
                  <li>Register for a Tikkie business account at tikkie.me</li>
                  <li>Apply for API access through the Tikkie developer portal</li>
                  <li>Create an app and get your API key and app token</li>
                  <li>Enter your credentials above</li>
                  <li>Test the connection to ensure payment links can be created</li>
                </ol>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Tikkie (Primary)</option>
                  <option>Stripe</option>
                  <option>PayPal</option>
                  <option>Square</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.lateFee}
                    onChange={(e) => handleInputChange('lateFee', e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (days)</label>
                <input
                  type="number"
                  value={formData.gracePeriod}
                  onChange={(e) => handleInputChange('gracePeriod', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="space-y-6">
          {/* Notification Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Bell className="w-5 h-5 text-orange-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Payment Received</p>
                  <p className="text-sm text-gray-600">Get notified when payments are received</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Overdue Payments</p>
                  <p className="text-sm text-gray-600">Alert when payments are overdue</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Maintenance Requests</p>
                  <p className="text-sm text-gray-600">New maintenance requests</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Shield className="w-5 h-5 text-red-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-600">Update your account password</p>
              </button>

              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Enable 2FA for enhanced security</p>
              </button>

              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium text-gray-900">Login History</p>
                <p className="text-sm text-gray-600">View recent login activity</p>
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Globe className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Support</h2>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleRestartOnboarding}
                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <span className="text-gray-700 font-medium">Herstart Setup Wizard</span>
                  <p className="text-xs text-gray-500">Doorloop de installatie opnieuw</p>
                </div>
              </button>

              <button 
                onClick={() => alert('Bellen naar ondersteuning op +31-20-LANDLORDY (5263-5679)')}
                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-700">Call Support</span>
              </button>

              <button 
                onClick={() => window.open('mailto:support@landlordy.nl')}
                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-700">Email Support</span>
              </button>

              <button 
                onClick={() => alert('Live chat feature coming soon!')}
                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-700">Live Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Connection Modal */}
      {showWhatsappModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect WhatsApp Business</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={formData.whatsappPhone}
                  onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
                  placeholder="+31 6 12345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Token</label>
                <input
                  type="password"
                  value={formData.whatsappToken}
                  onChange={(e) => handleInputChange('whatsappToken', e.target.value)}
                  placeholder="Enter your WhatsApp API token"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowWhatsappModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConnectWhatsApp}
                disabled={isConnecting}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tikkie Connection Modal */}
      {showTikkieModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect Tikkie Account</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={formData.tikkieApiKey}
                  onChange={(e) => handleInputChange('tikkieApiKey', e.target.value)}
                  placeholder="Enter your Tikkie API key"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">App Token</label>
                <input
                  type="password"
                  value={formData.tikkieAppToken}
                  onChange={(e) => handleInputChange('tikkieAppToken', e.target.value)}
                  placeholder="Enter your Tikkie app token"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowTikkieModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConnectTikkie}
                disabled={isConnecting}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;