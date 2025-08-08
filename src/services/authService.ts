// Production authentication service
// This integrates with a real backend API for user management

const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_API_URL;

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  createdAt: string;
}

class AuthService {
  private apiUrl: string;
  private isDemoMode: boolean;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'https://api.landlordy.nl';
    this.isDemoMode = isDevelopment || !import.meta.env.VITE_API_URL;
  }

  // Register a new user
  async register(data: RegisterData): Promise<{ success: boolean; message: string }> {
    // Demo mode fallback
    if (this.isDemoMode) {
      return this.handleDemoRegistration(data);
    }

    try {
      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, message: result.message || 'Registratie mislukt' };
      }

      return { 
        success: true, 
        message: 'Account aangemaakt! Controleer je e-mail voor de verificatielink.' 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Er is een fout opgetreden bij het aanmaken van je account.' };
    }
  }

  // Demo registration fallback
  private async handleDemoRegistration(data: RegisterData): Promise<{ success: boolean; message: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('landlordy_demo_users') || '[]');
    const userExists = existingUsers.find((user: any) => user.email === data.email);
    
    if (userExists) {
      return { success: false, message: 'Er bestaat al een account met dit e-mailadres.' };
    }
    
    // Create demo user
    const newUser = {
      id: Date.now().toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      verificationToken: `demo_token_${Date.now()}`
    };
    
    // Store in localStorage
    existingUsers.push(newUser);
    localStorage.setItem('landlordy_demo_users', JSON.stringify(existingUsers));
    
    return { 
      success: true, 
      message: 'Account aangemaakt! In demo modus kun je direct inloggen zonder e-mail verificatie.' 
    };
  }

  // Verify email with token
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    // Demo mode fallback
    if (this.isDemoMode) {
      return this.handleDemoVerification(token);
    }

    try {
      const response = await fetch(`${this.apiUrl}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, message: result.message || 'Verificatie mislukt' };
      }

      return { success: true, message: 'E-mail succesvol geverifieerd! Je kunt nu inloggen.' };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, message: 'Er is een fout opgetreden bij het verifiëren van je e-mail.' };
    }
  }

  // Demo verification fallback
  private async handleDemoVerification(token: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUsers = JSON.parse(localStorage.getItem('landlordy_demo_users') || '[]');
    const userIndex = existingUsers.findIndex((user: any) => user.verificationToken === token);
    
    if (userIndex === -1) {
      return { success: false, message: 'Ongeldige of verlopen verificatie token.' };
    }
    
    // Mark as verified
    existingUsers[userIndex].isEmailVerified = true;
    existingUsers[userIndex].verificationToken = null;
    localStorage.setItem('landlordy_demo_users', JSON.stringify(existingUsers));
    
    return { success: true, message: 'E-mail succesvol geverifieerd! Je kunt nu inloggen.' };
  }

  // Login user
  async login(data: LoginData): Promise<{ success: boolean; message: string; user?: User }> {
    // Demo mode fallback
    if (this.isDemoMode) {
      return this.handleDemoLogin(data);
    }

    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, message: result.message || 'Inloggen mislukt' };
      }

      // Store JWT token
      localStorage.setItem('landlordy_token', result.token);
      localStorage.setItem('landlordy_user', JSON.stringify(result.user));

      return { 
        success: true, 
        message: 'Succesvol ingelogd!', 
        user: result.user 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Er is een fout opgetreden bij het inloggen.' };
    }
  }

  // Demo login fallback
  private async handleDemoLogin(data: LoginData): Promise<{ success: boolean; message: string; user?: User }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const existingUsers = JSON.parse(localStorage.getItem('landlordy_demo_users') || '[]');
    const user = existingUsers.find((u: any) => u.email === data.email);
    
    if (!user) {
      return { success: false, message: 'Ongeldig e-mailadres of wachtwoord.' };
    }
    
    // In demo mode, skip email verification requirement
    const demoToken = `demo_jwt_${Date.now()}`;
    localStorage.setItem('landlordy_token', demoToken);
    localStorage.setItem('landlordy_user', JSON.stringify({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: true // Always true in demo mode
    }));
    
    return { 
      success: true, 
      message: 'Succesvol ingelogd in demo modus!', 
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: true,
        createdAt: user.createdAt
      }
    };
  }

  // Get current user from session
  getCurrentUser(): User | null {
    try {
      const user = localStorage.getItem('landlordy_user');
      const token = localStorage.getItem('landlordy_token');
      
      if (user && token) {
        return JSON.parse(user);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('landlordy_token');
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('landlordy_token');
    localStorage.removeItem('landlordy_user');
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, message: result.message || 'Versturen mislukt' };
      }

      return { success: true, message: 'Nieuwe verificatie e-mail verstuurd!' };
    } catch (error) {
      console.error('Resend verification error:', error);
      return { success: false, message: 'Er is een fout opgetreden bij het versturen van de verificatie e-mail.' };
    }
  }

  // Make authenticated API requests
  async apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle token expiration
    if (response.status === 401) {
      this.logout();
      window.location.reload();
    }

    return response;
  }
}

export const authService = new AuthService();
export default AuthService;