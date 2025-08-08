import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

interface TikkiePaymentRequest {
  amountInCents: number;
  description: string;
  externalId: string;
  referenceId?: string;
}

interface TikkieResponse {
  paymentRequestToken: string;
  url: string;
  expiryDate: string;
  status: string;
  amountInCents: number;
  description: string;
  createdDateTime: string;
}

const TIKKIE_API_URL = 'https://api.tikkie.me/tikkie-api/v2';

export async function createTikkiePaymentLink(request: TikkiePaymentRequest): Promise<TikkieResponse> {
  try {
    const response = await fetch(`${TIKKIE_API_URL}/paymentrequests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TIKKIE_API_KEY}`,
        'Content-Type': 'application/json',
        'X-App-Token': process.env.TIKKIE_APP_TOKEN!,
      },
      body: JSON.stringify({
        amountInCents: request.amountInCents,
        currency: 'EUR',
        description: request.description,
        externalId: request.externalId,
        referenceId: request.referenceId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tikkie API error:', response.status, errorText);
      throw new Error(`Tikkie API error: ${response.status}`);
    }

    const result = await response.json() as TikkieResponse;
    return result;
  } catch (error) {
    console.error('Error creating Tikkie payment request:', error);
    throw new Error('Failed to create Tikkie payment request');
  }
}

export async function getTikkiePaymentStatus(paymentRequestToken: string): Promise<TikkieResponse> {
  try {
    const response = await fetch(`${TIKKIE_API_URL}/paymentrequests/${paymentRequestToken}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TIKKIE_API_KEY}`,
        'X-App-Token': process.env.TIKKIE_APP_TOKEN!,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tikkie API error:', response.status, errorText);
      throw new Error(`Tikkie API error: ${response.status}`);
    }

    const result = await response.json() as TikkieResponse;
    return result;
  } catch (error) {
    console.error('Error fetching Tikkie payment status:', error);
    throw new Error('Failed to fetch Tikkie payment status');
  }
}

export async function getTikkiePayments(paymentRequestToken: string): Promise<any[]> {
  try {
    const response = await fetch(`${TIKKIE_API_URL}/paymentrequests/${paymentRequestToken}/payments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TIKKIE_API_KEY}`,
        'X-App-Token': process.env.TIKKIE_APP_TOKEN!,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tikkie API error:', response.status, errorText);
      throw new Error(`Tikkie API error: ${response.status}`);
    }

    const result = await response.json() as { payments: any[] };
    return result.payments || [];
  } catch (error) {
    console.error('Error fetching Tikkie payments:', error);
    throw new Error('Failed to fetch Tikkie payments');
  }
}

export async function testTikkieConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${TIKKIE_API_URL}/platforms`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TIKKIE_API_KEY}`,
        'X-App-Token': process.env.TIKKIE_APP_TOKEN!,
      },
    });

    if (!response.ok) {
      throw new Error(`Tikkie API error: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: 'Tikkie connection successful',
    };
  } catch (error) {
    console.error('Tikkie connection test failed:', error);
    return {
      success: false,
      message: 'Failed to connect to Tikkie API',
    };
  }
}