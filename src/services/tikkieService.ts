// Production Tikkie API integration service

export interface TikkieConfig {
  apiKey: string;
  appToken: string;
  baseUrl: string;
}

export interface CreatePaymentRequestData {
  amountInCents: number;
  currency: string;
  description: string;
  externalId: string;
  referenceId?: string;
}

export interface TikkiePaymentRequest {
  paymentRequestToken: string;
  url: string;
  expiryDate: string;
  status: 'OPEN' | 'CLOSED' | 'EXPIRED';
  amountInCents: number;
  description: string;
  referenceId?: string;
  createdDateTime: string;
}

class TikkieService {
  private config: TikkieConfig;

  constructor(config: TikkieConfig) {
    this.config = config;
  }

  // Create a new Tikkie payment request
  async createPaymentRequest(data: CreatePaymentRequestData): Promise<TikkiePaymentRequest> {
    try {
      const response = await fetch(`${this.config.baseUrl}/paymentrequests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'X-App-Token': this.config.appToken,
        },
        body: JSON.stringify({
          amountInCents: data.amountInCents,
          currency: data.currency,
          description: data.description,
          externalId: data.externalId,
          referenceId: data.referenceId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tikkie API error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating Tikkie payment request:', error);
      throw new Error('Failed to create Tikkie payment request');
    }
  }

  // Get payment request status
  async getPaymentRequest(paymentRequestToken: string): Promise<TikkiePaymentRequest> {
    try {
      const response = await fetch(`${this.config.baseUrl}/paymentrequests/${paymentRequestToken}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-App-Token': this.config.appToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Tikkie API error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching Tikkie payment request:', error);
      throw new Error('Failed to fetch Tikkie payment request');
    }
  }

  // Get all payments for a payment request
  async getPayments(paymentRequestToken: string) {
    try {
      const response = await fetch(`${this.config.baseUrl}/paymentrequests/${paymentRequestToken}/payments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-App-Token': this.config.appToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Tikkie API error: ${response.status}`);
      }

      const result = await response.json();
      return result.payments || [];
    } catch (error) {
      console.error('Error fetching Tikkie payments:', error);
      throw new Error('Failed to fetch Tikkie payments');
    }
  }

  // Send payment request via WhatsApp (integration with WhatsApp Business API)
  async sendPaymentLinkViaWhatsApp(phoneNumber: string, paymentUrl: string, amount: number, tenantName: string) {
    try {
      const whatsappApiUrl = import.meta.env.VITE_WHATSAPP_API_URL;
      const whatsappToken = import.meta.env.VITE_WHATSAPP_TOKEN;

      if (!whatsappApiUrl || !whatsappToken) {
        throw new Error('WhatsApp API configuration missing');
      }

      const message = `Hallo ${tenantName}! Je maandelijkse huur van €${(amount / 100).toFixed(2)} is verschuldigd. Betaal eenvoudig via deze Tikkie link: ${paymentUrl}`;
      
      const response = await fetch(`${whatsappApiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneNumber.replace(/\s+/g, '').replace(/^\+/, ''),
          type: 'text',
          text: {
            body: message
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        messageId: result.messages[0].id,
        message: 'Payment link sent successfully via WhatsApp'
      };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw new Error('Failed to send payment link via WhatsApp');
    }
  }

  // Test WhatsApp connection
  async testWhatsAppConnection(phoneNumber: string, apiToken: string) {
    try {
      const whatsappApiUrl = import.meta.env.VITE_WHATSAPP_API_URL;
      
      const response = await fetch(`${whatsappApiUrl}/phone_numbers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        message: 'WhatsApp connection test successful',
        accountInfo: {
          phoneNumber,
          businessName: result.data[0]?.display_phone_number || 'Unknown',
          verified: result.data[0]?.verified_name || false
        }
      };
    } catch (error) {
      console.error('WhatsApp connection test failed:', error);
      throw new Error('Failed to connect to WhatsApp Business API');
    }
  }

  // Test Tikkie connection
  async testTikkieConnection() {
    try {
      const response = await fetch(`${this.config.baseUrl}/platforms`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-App-Token': this.config.appToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Tikkie API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        message: 'Tikkie connection test successful',
        accountInfo: {
          businessName: result.platforms[0]?.name || 'Unknown',
          accountNumber: result.platforms[0]?.phoneNumber || 'Unknown',
          verified: true
        }
      };
    } catch (error) {
      console.error('Tikkie connection test failed:', error);
      throw new Error('Failed to connect to Tikkie API');
    }
  }
}

// Production configuration from environment variables
const productionConfig: TikkieConfig = {
  apiKey: import.meta.env.VITE_TIKKIE_API_KEY || '',
  appToken: import.meta.env.VITE_TIKKIE_APP_TOKEN || '',
  baseUrl: 'https://api.tikkie.me/tikkie-api/v2'
};

export const tikkieService = new TikkieService(productionConfig);
export default TikkieService;