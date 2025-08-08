import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  X, 
  Star,
  Shield,
  MessageSquare,
  BarChart3,
  Users,
  Building2
} from 'lucide-react';

interface SubscriptionProps {
  onClose: () => void;
  currentPlan?: 'free' | 'pro';
}

const Subscription: React.FC<SubscriptionProps> = ({ onClose, currentPlan = 'free' }) => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>(currentPlan);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ideal'>('ideal');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Abonnement succesvol geactiveerd! Welkom bij HuurBeheer Pro.');
      onClose();
    }, 2000);
  };

  const handleCancelSubscription = () => {
    if (confirm('Weet je zeker dat je je abonnement wilt opzeggen?')) {
      alert('Abonnement opgezegd. Je kunt de app gebruiken tot het einde van je huidige periode.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Kies je Abonnement</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Free Plan */}
          <div className={`border-2 rounded-xl p-6 ${selectedPlan === 'free' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gratis</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1">€0</div>
              <div className="text-gray-600">per maand</div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">Tot 5 huurders</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">1 pand</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">Basis betalingsoverzicht</span>
              </li>
              <li className="flex items-center">
                <X className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-gray-400">WhatsApp integratie</span>
              </li>
              <li className="flex items-center">
                <X className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-gray-400">Automatische Tikkie links</span>
              </li>
              <li className="flex items-center">
                <X className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-gray-400">Uitgebreide analyses</span>
              </li>
            </ul>

            <button
              onClick={() => setSelectedPlan('free')}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedPlan === 'free'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {currentPlan === 'free' ? 'Huidige Plan' : 'Kies Gratis'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className={`border-2 rounded-xl p-6 relative ${selectedPlan === 'pro' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Populair
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1">€20</div>
              <div className="text-gray-600">per maand</div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">Onbeperkte huurders</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">Onbeperkte panden</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">WhatsApp integratie</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">Automatische Tikkie links</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">Uitgebreide analyses</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">Automatische herinneringen</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">Prioriteit ondersteuning</span>
              </li>
            </ul>

            <button
              onClick={() => setSelectedPlan('pro')}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedPlan === 'pro'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {currentPlan === 'pro' ? 'Huidige Plan' : 'Upgrade naar Pro'}
            </button>
          </div>
        </div>

        {/* Payment Section */}
        {selectedPlan === 'pro' && currentPlan !== 'pro' && (
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Betaalgegevens</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Betaalmethode</h4>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="ideal"
                      checked={paymentMethod === 'ideal'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'ideal')}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-pink-100 rounded mr-3 flex items-center justify-center">
                        <span className="text-pink-600 font-bold text-xs">iD</span>
                      </div>
                      <span className="font-medium">iDEAL</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <CreditCard className="w-8 h-8 text-gray-600 mr-3" />
                      <span className="font-medium">Creditcard</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <span className="mr-2">🏠</span>
                  <label className="block text-sm font-medium text-gray-700">Landlordy Pro</label>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">HuurBeheer Pro</span>
                    <span className="font-medium">€20,00</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">BTW (21%)</span>
                    <span className="font-medium">€4,20</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Totaal</span>
                      <span className="font-bold text-lg">€24,20</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Maandelijks gefactureerd. Opzeggen kan altijd.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2" />
                <span>Veilige betaling via SSL encryptie</span>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verwerken...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Abonnement Starten</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current Subscription Management */}
        {currentPlan === 'pro' && (
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Abonnement Beheren</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">HuurBeheer Pro Actief</p>
                  <p className="text-sm text-green-700">Volgende betaling: 15 februari 2024</p>
                </div>
                <span className="text-green-600 font-bold">€20/maand</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Betalingsgegevens Wijzigen
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Factuurgeschiedenis
              </button>
              <button 
                onClick={handleCancelSubscription}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Abonnement Opzeggen
              </button>
            </div>
          </div>
        )}

        {/* Features Comparison */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Waarom kiezen voor Pro?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Automatisering</h4>
              <p className="text-sm text-gray-600">Automatische Tikkie links en WhatsApp herinneringen besparen je uren per maand.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Inzichten</h4>
              <p className="text-sm text-gray-600">Uitgebreide analyses helpen je je vastgoedportefeuille te optimaliseren.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Schaalbaarheid</h4>
              <p className="text-sm text-gray-600">Beheer onbeperkt panden en huurders terwijl je groeit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;