import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class EmailService {
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@caregiver-platform.com';

    if (apiKey) {
      sgMail.setApiKey(apiKey);
    } else {
      console.warn('SendGrid API key not configured. Email sending will be mocked.');
    }
  }

  /**
   * Send welcome email with onboarding checklist
   */
  async sendWelcomeEmail(email: string, name: string, role: string): Promise<void> {
    const template = this.getWelcomeTemplate(name, role);

    await this.sendEmail(email, template.subject, template.html, template.text);
  }

  /**
   * Send invoice email with PDF attachment
   */
  async sendInvoiceEmail(
    email: string,
    invoiceNumber: string,
    amount: number,
    pdfBuffer?: Buffer,
  ): Promise<void> {
    const template = this.getInvoiceTemplate(invoiceNumber, amount);

    const attachments = pdfBuffer
      ? [
          {
            content: pdfBuffer.toString('base64'),
            filename: `invoice-${invoiceNumber}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment',
          },
        ]
      : [];

    await this.sendEmail(email, template.subject, template.html, template.text, attachments);
  }

  /**
   * Send weekly care summary
   */
  async sendWeeklyCareSummary(
    email: string,
    patientName: string,
    summary: {
      totalHours: number;
      medicationCompliance: number;
      activities: string[];
      notes: string;
    },
  ): Promise<void> {
    const template = this.getWeeklySummaryTemplate(patientName, summary);

    await this.sendEmail(email, template.subject, template.html, template.text);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetToken: string, resetUrl: string): Promise<void> {
    const subject = 'Reset Your Password - CaregiverBD';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password for your CaregiverBD account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">CaregiverBD - Professional Care Services</p>
      </div>
    `;
    const text = `Password Reset Request\n\nYou requested to reset your password.\nReset link: ${resetUrl}\nThis link will expire in 1 hour.`;

    await this.sendEmail(email, subject, html, text);
  }

  /**
   * Generic email sender
   */
  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string,
    attachments: any[] = [],
  ): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
      console.log(`[MOCK EMAIL] Content: ${text.substring(0, 100)}...`);
      return;
    }

    const msg: sgMail.MailDataRequired = {
      to,
      from: this.fromEmail,
      subject,
      text,
      html,
      attachments,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email notification');
    }
  }

  /**
   * Get welcome email template
   */
  private getWelcomeTemplate(name: string, role: string): EmailTemplate {
    const roleChecklist = this.getOnboardingChecklist(role);

    return {
      subject: 'Welcome to CaregiverBD!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to CaregiverBD, ${name}!</h2>
          <p>We're excited to have you join our platform as a ${role.toLowerCase()}.</p>
          <h3>Get Started:</h3>
          <ul>
            ${roleChecklist.map(item => `<li>${item}</li>`).join('')}
          </ul>
          <p>If you have any questions, feel free to contact our support team.</p>
          <hr style="margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">CaregiverBD - Professional Care Services</p>
        </div>
      `,
      text: `Welcome to CaregiverBD, ${name}!\n\nGet started:\n${roleChecklist.map((item, i) => `${i + 1}. ${item}`).join('\n')}`,
    };
  }

  /**
   * Get invoice email template
   */
  private getInvoiceTemplate(invoiceNumber: string, amount: number): EmailTemplate {
    return {
      subject: `Invoice ${invoiceNumber} - CaregiverBD`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Payment Invoice</h2>
          <p>Thank you for your payment!</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Invoice Number:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${invoiceNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">BDT ${amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleDateString()}</td>
            </tr>
          </table>
          <p>The invoice is attached to this email.</p>
          <hr style="margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">CaregiverBD - Professional Care Services</p>
        </div>
      `,
      text: `Invoice ${invoiceNumber}\nAmount: BDT ${amount.toFixed(2)}\nDate: ${new Date().toLocaleDateString()}`,
    };
  }

  /**
   * Get weekly summary template
   */
  private getWeeklySummaryTemplate(
    patientName: string,
    summary: { totalHours: number; medicationCompliance: number; activities: string[]; notes: string },
  ): EmailTemplate {
    return {
      subject: `Weekly Care Summary for ${patientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Weekly Care Summary - ${patientName}</h2>
          <p><strong>Total Care Hours:</strong> ${summary.totalHours}</p>
          <p><strong>Medication Compliance:</strong> ${summary.medicationCompliance}%</p>
          <h3>Activities This Week:</h3>
          <ul>
            ${summary.activities.map(activity => `<li>${activity}</li>`).join('')}
          </ul>
          <h3>Caregiver Notes:</h3>
          <p>${summary.notes}</p>
          <hr style="margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">CaregiverBD - Professional Care Services</p>
        </div>
      `,
      text: `Weekly Care Summary - ${patientName}\nTotal Hours: ${summary.totalHours}\nMedication Compliance: ${summary.medicationCompliance}%\nActivities:\n${summary.activities.join('\n')}\nNotes: ${summary.notes}`,
    };
  }

  /**
   * Get onboarding checklist based on role
   */
  private getOnboardingChecklist(role: string): string[] {
    const checklists = {
      GUARDIAN: [
        'Complete your profile',
        'Add patient information',
        'Browse available care packages',
        'Schedule your first care session',
      ],
      CAREGIVER: [
        'Complete your profile',
        'Upload verification documents',
        'Set your availability',
        'Wait for verification approval',
      ],
      COMPANY: [
        'Complete company profile',
        'Upload business documents',
        'Add caregivers to your team',
        'Create service packages',
      ],
    };

    return checklists[role as keyof typeof checklists] || ['Complete your profile', 'Explore the platform'];
  }
}
