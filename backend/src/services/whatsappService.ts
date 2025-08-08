import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string }> {
  try {
    const whatsappApiUrl = process.env.WHATSAPP_API_URL;
    const whatsappToken = process.env.WHATSAPP_TOKEN;

    if (!whatsappApiUrl || !whatsappToken) {
      throw new Error('WhatsApp API configuration missing');
    }

    // Clean phone number (remove spaces, dashes, and ensure proper format)
    const cleanPhoneNumber = phoneNumber.replace(/\s+/g, '').replace(/-/g, '').replace(/^\+/, '');

    const response = await fetch(`${whatsappApiUrl}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: cleanPhoneNumber,
        type: 'text',
        text: {
          body: message
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WhatsApp API error:', response.status, errorText);
      throw new Error(`WhatsApp API error: ${response.status}`);
    }

    const result = await response.json() as any;
    return {
      success: true,
      messageId: result.messages?.[0]?.id
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw new Error('Failed to send WhatsApp message');
  }
}

export async function testWhatsAppConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const whatsappApiUrl = process.env.WHATSAPP_API_URL;
    const whatsappToken = process.env.WHATSAPP_TOKEN;

    if (!whatsappApiUrl || !whatsappToken) {
      throw new Error('WhatsApp API configuration missing');
    }

    // Test by getting phone number info
    const phoneNumberId = whatsappApiUrl.split('/').pop();
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: 'WhatsApp connection successful',
    };
  } catch (error) {
    console.error('WhatsApp connection test failed:', error);
    return {
      success: false,
      message: 'Failed to connect to WhatsApp Business API',
    };
  }
}