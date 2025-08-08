import React, { useState } from 'react';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  MessageSquare,
  CreditCard,
  User,
  Building2,
  Users,
  Settings,
  ExternalLink,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { tikkieService } from '../../services/tikkieService';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connections, setConnections] = useState({
    whatsapp: false,
    tikkie: false,
    profile: false
  });
  const [formData, setFormData] = useState({
    whatsappPhone: '',
    whatsappToken: '',
    tikkieApiKey: '',
    tikkieAppToken: '',
    businessName: '',
    businessAddress: ''
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const steps = [
    {
      id: 'welcome',
      title: 'Welkom bij Landlordy! 🏠',
      description: 'Laten we je account instellen zodat je direct kunt beginnen met het beheren van je huurpanden.',
      icon: User,
      color: 'blue'
    },
    {
      id: 'profile',
      title: 'Bedrijfsprofiel',
      description: 'Vertel ons iets over je vastgoedbedrijf',
      icon: Building2,
      color: 'purple'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Integratie',
      description: 'Verbind je WhatsApp Business account voor automatische berichten',
      icon: MessageSquare,
      color: 'green'
    },
    {
      id: 'tikkie',
      title: 'Tikkie Integratie',
      description: 'Stel Tikkie in voor automatische betaallinks',
      icon: CreditCard,
      color: 'orange'
    },
    {
      id: 'complete',
      title: 'Alles klaar! 🎉',
      description: 'Je account is volledig ingesteld. Je kunt nu beginnen met het toevoegen van panden en huurders.',
      icon: CheckCircle,
      color: 'green'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProfileSetup = () => {
    if (formData.businessName && formData.businessAddress) {
      setConnections(prev => ({ ...prev, profile: true }));
      markStepCompleted(1);
      nextStep();
    } else {
      alert('Vul alle velden in om door te gaan');
    }
  };

  const handleWhatsAppSetup = async () => {
    if (!formData.whatsappPhone || !formData.whatsappToken) {
      alert('Vul alle WhatsApp gegevens in');
      return;
    }

    setIsConnecting(true);
    try {
      const result = await tikkieService.testWhatsAppConnection(
        formData.whatsappPhone,
        formData.whatsappToken
      );
      
      if (result.success) {
        setConnections(prev => ({ ...prev, whatsapp: true }));
        markStepCompleted(2);
        alert('WhatsApp succesvol verbonden!');
        nextStep();
      }
    } catch (error) {
      alert('WhatsApp verbinding mislukt. Controleer je gegevens.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTikkieSetup = async () => {
    if (!formData.tikkieApiKey || !formData.tikkieAppToken) {
      alert('Vul alle Tikkie gegevens in');
      return;
    }

    setIsConnecting(true);
    try {
      const result = await tikkieService.testTikkieConnection();
      
      if (result.success) {
        setConnections(prev => ({ ...prev, tikkie: true }));
        markStepCompleted(3);
        alert('Tikkie succesvol verbonden!');
        nextStep();
      }
    } catch (error) {
      alert('Tikkie verbinding mislukt. Controleer je gegevens.');
    } finally {
      setIsConnecting(false);
    }
  };

  const markStepCompleted = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps(prev => [...prev, stepIndex]);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    nextStep();
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              🏠
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welkom bij Landlordy!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We gaan je account instellen zodat je direct kunt beginnen met het professioneel beheren van je huurpanden.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Wat gaan we instellen?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Je bedrijfsprofiel</li>
                <li>✓ WhatsApp Business integratie</li>
                <li>✓ Tikkie betaallinks</li>
                <li>✓ Automatische herinneringen</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">Dit duurt ongeveer 5 minuten</p>
          </div>
        );

      case 'profile':
        return (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bedrijfsprofiel</h2>
              <p className="text-gray-600">Deze informatie wordt gebruikt in je communicatie met huurders</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrijfsnaam *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Vastgoed Beheer B.V."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrijfsadres *
                </label>
                <input
                  type="text"
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  placeholder="Hoofdstraat 123, 1000 AB Amsterdam"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">💡 Tip</h4>
                <p className="text-sm text-purple-800">
                  Deze gegevens verschijnen in je e-mails en berichten naar huurders, dus zorg dat ze professioneel zijn.
                </p>
              </div>
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Business</h2>
              <p className="text-gray-600">Verstuur automatisch huurherinneringen via WhatsApp</p>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-green-900 mb-2">📱 Vereisten</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• WhatsApp Business account</li>
                  <li>• WhatsApp Business API toegang</li>
                  <li>• API token van Facebook Business</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Business Telefoonnummer
                </label>
                <input
                  type="text"
                  value={formData.whatsappPhone}
                  onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
                  placeholder="+31 6 12345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp API Token
                </label>
                <input
                  type="password"
                  value={formData.whatsappToken}
                  onChange={(e) => handleInputChange('whatsappToken', e.target.value)}
                  placeholder="Plak hier je WhatsApp API token"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Hulp nodig?
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  Volg deze stappen om je WhatsApp Business API in te stellen:
                </p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Ga naar <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">Facebook Business</a></li>
                  <li>Maak een WhatsApp Business account aan</li>
                  <li>Vraag API toegang aan</li>
                  <li>Kopieer je API token hieronder</li>
                </ol>
              </div>
            </div>
          </div>
        );

      case 'tikkie':
        return (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tikkie Integratie</h2>
              <p className="text-gray-600">Maak automatisch betaallinks voor huurbetalingen</p>
            </div>

            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-orange-900 mb-2">💳 Vereisten</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Tikkie Business account</li>
                  <li>• API toegang via ABN AMRO</li>
                  <li>• API sleutel en app token</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tikkie API Sleutel
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.tikkieApiKey}
                    onChange={(e) => handleInputChange('tikkieApiKey', e.target.value)}
                    placeholder="Plak hier je Tikkie API sleutel"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => copyToClipboard('demo_tikkie_api_key_12345', 'tikkieApiKey')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Kopieer demo sleutel"
                  >
                    {copiedField === 'tikkieApiKey' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tikkie App Token
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.tikkieAppToken}
                    onChange={(e) => handleInputChange('tikkieAppToken', e.target.value)}
                    placeholder="Plak hier je Tikkie app token"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => copyToClipboard('demo_tikkie_app_token_67890', 'tikkieAppToken')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Kopieer demo token"
                  >
                    {copiedField === 'tikkieAppToken' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Tikkie API Instellen
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  Volg deze stappen om Tikkie API toegang te krijgen:
                </p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Ga naar <a href="https://developer.tikkie.me" target="_blank" rel="noopener noreferrer" className="underline">Tikkie Developer Portal</a></li>
                  <li>Registreer je bedrijf</li>
                  <li>Vraag API toegang aan</li>
                  <li>Maak een app aan en kopieer je credentials</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Demo Modus</h4>
                    <p className="text-sm text-yellow-800">
                      Voor nu kun je de demo credentials gebruiken (klik op de kopieer knoppen). 
                      Later kun je deze vervangen door je echte Tikkie API gegevens.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              🎉
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gefeliciteerd!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Je Landlordy account is volledig ingesteld. Je kunt nu beginnen met het toevoegen van panden en huurders.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className={`p-4 rounded-lg border-2 ${connections.profile ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-center mb-2">
                  {connections.profile ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">Bedrijfsprofiel</h3>
                <p className="text-sm text-gray-600">
                  {connections.profile ? 'Ingesteld' : 'Overgeslagen'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border-2 ${connections.whatsapp ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-center mb-2">
                  {connections.whatsapp ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                <p className="text-sm text-gray-600">
                  {connections.whatsapp ? 'Verbonden' : 'Overgeslagen'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border-2 ${connections.tikkie ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-center mb-2">
                  {connections.tikkie ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">Tikkie</h3>
                <p className="text-sm text-gray-600">
                  {connections.tikkie ? 'Verbonden' : 'Overgeslagen'}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">🚀 Volgende stappen</h3>
              <ul className="text-sm text-blue-800 space-y-2 text-left">
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 text-xs font-bold">1</div>
                  Voeg je eerste pand toe
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 text-xs font-bold">2</div>
                  Voeg huurders toe aan je panden
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 text-xs font-bold">3</div>
                  Stel automatische betalingsherinneringen in
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Je kunt deze instellingen later altijd wijzigen in het instellingen menu.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepActions = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="flex justify-center">
            <button
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <span>Laten we beginnen</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        );

      case 'profile':
        return (
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Vorige</span>
            </button>
            <div className="flex space-x-3">
              <button
                onClick={skipStep}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Overslaan
              </button>
              <button
                onClick={handleProfileSetup}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <span>Opslaan & Doorgaan</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Vorige</span>
            </button>
            <div className="flex space-x-3">
              <button
                onClick={skipStep}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Later instellen
              </button>
              <button
                onClick={handleWhatsAppSetup}
                disabled={isConnecting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verbinden...</span>
                  </>
                ) : (
                  <>
                    <span>Verbinden & Doorgaan</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'tikkie':
        return (
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Vorige</span>
            </button>
            <div className="flex space-x-3">
              <button
                onClick={skipStep}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Later instellen
              </button>
              <button
                onClick={handleTikkieSetup}
                disabled={isConnecting}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verbinden...</span>
                  </>
                ) : (
                  <>
                    <span>Verbinden & Doorgaan</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="flex justify-center">
            <button
              onClick={onComplete}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <span>Start met Landlordy</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Account Instellen</h1>
            <span className="text-sm text-gray-500">
              Stap {currentStep + 1} van {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-8">
          {renderStepContent()}
        </div>

        {/* Step Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          {renderStepActions()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;