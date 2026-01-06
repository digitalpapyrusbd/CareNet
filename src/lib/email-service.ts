import sgMail from '@sendgrid/mail';

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Interface for email parameters
 */
export interface EmailParams {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: {
    email: string;
    name?: string;
  };
}

/**
 * Sends an email using SendGrid
 * @param params Email parameters
 */
export async function sendEmail(params: EmailParams): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured, skipping email send');
    return;
  }

  const msg = {
    to: params.to,
    from: params.from || {
      email: process.env.SENDGRID_FROM_EMAIL || 'noreply@carenet.com',
      name: process.env.SENDGRID_FROM_NAME || 'CareNet Support'
    },
    subject: params.subject,
    html: params.html,
    text: params.text,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${params.to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Sends a test email
 * @param to Email address to send to
 */
export async function sendTestEmail(to: string): Promise<void> {
  const testEmail = {
    to,
    subject: 'Test Email from CareNet',
    html: `
      <h1>Hello!</h1>
      <p>This is a test email from CareNet.</p>
      <p>If you received this, your email service is working correctly.</p>
    `,
    text: 'Hello! This is a test email from CareNet. If you received this, your email service is working correctly.',
  };

  await sendEmail(testEmail);
}
