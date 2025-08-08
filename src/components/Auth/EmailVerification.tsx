import React from 'react';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  onResendVerification: () => void;
  onBackToLogin: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  email, 
  onResendVerification, 
  onBackToLogin 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center text-2xl">
            📧
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Controleer je E-mail</h1>
        <p className="text-gray-600">We hebben een verificatielink gestuurd</p>
      </div>

      <div className="text-center mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700 mb-2">
            Een verificatie e-mail is verstuurd naar:
          </p>
          <p className="font-semibold text-blue-600 text-lg">{email}</p>
        </div>

        <div className="space-y-4 text-sm text-gray-600">
          <p>
            Klik op de link in de e-mail om je account te verifiëren en in te loggen.
          </p>
          <p>
            Controleer ook je spam/ongewenste e-mail map als je de e-mail niet ziet.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onResendVerification}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Verstuur E-mail Opnieuw
        </button>

        <button
          onClick={onBackToLogin}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Terug naar Inloggen
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;