import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { User } from '../../types';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import EmailVerification from './EmailVerification';
import OnboardingFlow from '../Onboarding/OnboardingFlow';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'verify'>('login');
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check for existing session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      
      // Check if user needs onboarding (first time login)
      const hasCompletedOnboarding = localStorage.getItem('landlordy_onboarding_completed');
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }

    // Check for verification token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const verifyToken = urlParams.get('verify');
    if (verifyToken) {
      handleEmailVerification(verifyToken);
    }

    setIsLoading(false);
  }, []);

  const handleEmailVerification = async (token: string) => {
    const result = await authService.verifyEmail(token);
    if (result.success) {
      alert(result.message);
      setAuthMode('login');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      alert(result.message);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    if (result.success && result.user) {
      setUser(result.user);
      
      // Check if user needs onboarding
      const hasCompletedOnboarding = localStorage.getItem('landlordy_onboarding_completed');
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    } else {
      alert(result.message);
    }
  };

  const handleRegister = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const result = await authService.register(data);
    if (result.success) {
      // Check if we're in demo mode
      const isDemoMode = import.meta.env.DEV || !import.meta.env.VITE_API_URL;
      
      if (isDemoMode) {
        alert(result.message + '\n\nJe kunt nu direct inloggen met je e-mailadres en wachtwoord.');
        setAuthMode('login');
      } else {
        setPendingVerificationEmail(data.email);
        setAuthMode('verify');
      }
    } else {
      alert(result.message);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const handleResendVerification = async () => {
    if (pendingVerificationEmail) {
      const result = await authService.resendVerificationEmail(pendingVerificationEmail);
      alert(result.message);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('landlordy_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Landlordy wordt geladen...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the main app
  if (user) {
    return (
      <div>
        {showOnboarding && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}
        {children}
        {/* Add logout functionality to the main app if needed */}
      </div>
    );
  }

  // Show authentication forms
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {authMode === 'login' && (
          <LoginForm 
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        )}
        {authMode === 'register' && (
          <RegisterForm 
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
        {authMode === 'verify' && (
          <EmailVerification 
            email={pendingVerificationEmail}
            onResendVerification={handleResendVerification}
            onBackToLogin={() => setAuthMode('login')}
          />
        )}
      </div>
    </div>
  );
};

export default AuthWrapper;