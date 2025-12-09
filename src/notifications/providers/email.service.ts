import sgMail from '@sendgrid/mail';

export class EmailService {
  constructor() {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured');
    } else {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  async sendEmail(to: string, subject: string, content: string, templateData?: Record<string, any>): Promise<void> {
    try {
      let finalContent = content;
      if (templateData) {
        // Simple template replacement
        Object.keys(templateData).forEach(key => {
          finalContent = finalContent.replace(new RegExp(`{{${key}}}`, 'g'), templateData[key]);
        });
      }

      const msg = {
        to,
        from: process.env.EMAIL_FROM || 'noreply@caregiver.com',
        subject,
        html: finalContent,
      };

      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
