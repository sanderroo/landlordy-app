import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

export async function sendVerificationEmail(email: string, token: string, name: string): Promise<void> {
  const verificationUrl = `${process.env.FRONTEND_URL}?verify=${token}`;
  
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Verifieer je Landlordy account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifieer je account</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 Landlordy</h1>
            <p>Welkom bij Landlordy!</p>
          </div>
          <div class="content">
            <h2>Hallo ${name},</h2>
            <p>Bedankt voor het aanmelden bij Landlordy, je professionele vastgoedbeheer platform.</p>
            <p>Klik op de onderstaande knop om je e-mailadres te verifiëren en je account te activeren:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verifieer Account</a>
            </p>
            <p>Of kopieer deze link naar je browser:</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">
              ${verificationUrl}
            </p>
            <p><strong>Deze link is 24 uur geldig.</strong></p>
            <p>Als je dit account niet hebt aangemaakt, kun je deze e-mail negeren.</p>
          </div>
          <div class="footer">
            <p>© 2024 Landlordy. Alle rechten voorbehouden.</p>
            <p>Dit is een automatisch gegenereerde e-mail, reageer hier niet op.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welkom bij Landlordy!
      
      Hallo ${name},
      
      Bedankt voor het aanmelden bij Landlordy. Klik op de onderstaande link om je account te verifiëren:
      
      ${verificationUrl}
      
      Deze link is 24 uur geldig.
      
      Als je dit account niet hebt aangemaakt, kun je deze e-mail negeren.
      
      © 2024 Landlordy
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, token: string, name: string): Promise<void> {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Reset je Landlordy wachtwoord',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset wachtwoord</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #DC2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 Landlordy</h1>
            <p>Wachtwoord Reset</p>
          </div>
          <div class="content">
            <h2>Hallo ${name},</h2>
            <p>Je hebt een wachtwoord reset aangevraagd voor je Landlordy account.</p>
            <p>Klik op de onderstaande knop om een nieuw wachtwoord in te stellen:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Wachtwoord</a>
            </p>
            <p>Of kopieer deze link naar je browser:</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            <p><strong>Deze link is 1 uur geldig.</strong></p>
            <p>Als je geen wachtwoord reset hebt aangevraagd, kun je deze e-mail negeren.</p>
          </div>
          <div class="footer">
            <p>© 2024 Landlordy. Alle rechten voorbehouden.</p>
            <p>Dit is een automatisch gegenereerde e-mail, reageer hier niet op.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Wachtwoord Reset - Landlordy
      
      Hallo ${name},
      
      Je hebt een wachtwoord reset aangevraagd. Klik op de onderstaande link om een nieuw wachtwoord in te stellen:
      
      ${resetUrl}
      
      Deze link is 1 uur geldig.
      
      Als je geen wachtwoord reset hebt aangevraagd, kun je deze e-mail negeren.
      
      © 2024 Landlordy
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPaymentConfirmationEmail(email: string, tenantName: string, amount: number, propertyName: string): Promise<void> {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Betaling ontvangen - Landlordy',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Betaling ontvangen</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10B981, #3B82F6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .amount { font-size: 24px; font-weight: bold; color: #10B981; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 Landlordy</h1>
            <p>Betaling Ontvangen</p>
          </div>
          <div class="content">
            <h2>Hallo ${tenantName},</h2>
            <p>We hebben je betaling succesvol ontvangen!</p>
            <div class="amount">€${amount.toFixed(2)}</div>
            <p><strong>Pand:</strong> ${propertyName}</p>
            <p><strong>Datum:</strong> ${new Date().toLocaleDateString('nl-NL')}</p>
            <p>Bedankt voor je tijdige betaling. Je huur is nu up-to-date.</p>
          </div>
          <div class="footer">
            <p>© 2024 Landlordy. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
}