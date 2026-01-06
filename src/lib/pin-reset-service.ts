import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendEmail } from './email-service';
import { prisma } from './db';

/**
 * Hashes a token using SHA-256
 * @param token The token to hash
 * @returns The hashed token
 */
export async function hashToken(token: string): Promise<string> {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generates a secure random token
 * @param length Length of the token in bytes (default: 32)
 * @returns A hex string token
 */
export function generateResetToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Interface for reset email parameters
 */
interface ResetEmailParams {
  email: string;
  name: string;
  resetToken: string;
  phone: string;
}

/**
 * Sends a password reset email to the user
 * @param params Email parameters
 */
export async function sendResetEmail(params: ResetEmailParams): Promise<void> {
  const { email, name, resetToken, phone } = params;

  // Generate frontend URL based on environment
  const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetUrl = `${frontendUrl}/reset-pin?token=${resetToken}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your PIN</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          width: 60px;
          height: 60px;
          background: radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }
        .logo svg {
          width: 30px;
          height: 30px;
          fill: white;
        }
        h1 {
          color: #535353;
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .subtitle {
          color: #848484;
          font-size: 16px;
          margin-bottom: 30px;
        }
        .content {
          margin-bottom: 30px;
        }
        p {
          margin-bottom: 15px;
        }
        .highlight {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .warning {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .reset-button {
          display: inline-block;
          background: radial-gradient(118.75% 157.07% at 34.74% -18.75%, #DB869A 0%, #8082ED 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(219, 134, 154, 0.3);
          transition: transform 0.2s;
        }
        .reset-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(219, 134, 154, 0.4);
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 14px;
        }
        .small {
          font-size: 12px;
          color: #888;
          margin-top: 20px;
        }
        .phone-info {
          background-color: #e7f3ff;
          border: 1px solid #b3d9ff;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h1>CareNet</h1>
          <div class="subtitle">Quality care, connected</div>
        </div>

        <div class="content">
          <h2 style="margin-top: 0;">Reset Your PIN</h2>

          <p>Hello ${name},</p>

          <p>We received a request to reset the PIN for your CareNet account associated with this email address.</p>

          <div class="highlight">
            <strong>Phone Number:</strong> ${phone}
          </div>

          <div class="phone-info">
            <strong>Important:</strong> This reset link is only for the account associated with the phone number above.
          </div>

          <p style="text-align: center;">
            <a href="${resetUrl}" class="reset-button">Reset Your PIN</a>
          </p>

          <div class="warning">
            <strong>Security Notice:</strong>
            <ul style="margin: 10px 0 0 20px; padding: 0;">
              <li>This link will expire in 15 minutes</li>
              <li>This link can only be used once</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>

          <p><strong>Alternative:</strong> If the button above doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">${resetUrl}</p>
        </div>

        <div class="footer">
          <p><strong>Didn't request this?</strong> If you didn't request a PIN reset, please ignore this email. Your PIN will remain unchanged.</p>

          <div class="small">
            <p>This email was sent to ${email} from CareNet.</p>
            <p>If you continue to have problems, please contact our support team.</p>
            <p>© ${new Date().getFullYear()} CareNet. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
CARENET - Reset Your PIN

Hello ${name},

We received a request to reset the PIN for your CareNet account.

Phone Number: ${phone}

To reset your PIN, please click the link below or copy and paste it into your browser:

${resetUrl}

SECURITY NOTICE:
- This link will expire in 15 minutes
- This link can only be used once
- If you didn't request this, please ignore this email

Alternative link: ${resetUrl}

If you didn't request this PIN reset, please ignore this email. Your PIN will remain unchanged.

This email was sent to ${email} from CareNet.
If you continue to have problems, please contact our support team.

© ${new Date().getFullYear()} CareNet. All rights reserved.
  `;

  await sendEmail({
    to: email,
    subject: 'Reset Your CareNet PIN',
    html: emailHtml,
    text: emailText,
  });
}

/**
 * Validates a PIN format
 * @param pin The PIN to validate
 * @returns True if valid, false otherwise
 */
export function validatePin(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

/**
 * Checks if a token has expired
 * @param expiry The expiry date
 * @returns True if expired, false otherwise
 */
export function isTokenExpired(expiry: Date): boolean {
  return new Date() > expiry;
}

/**
 * Clears a user's reset token
 * @param userId The user ID
 */
export async function clearResetToken(userId: string): Promise<void> {
  await prisma.users.update({
    where: { id: userId },
    data: {
      reset_token: null,
      reset_token_expiry: null,
    },
  });
}
