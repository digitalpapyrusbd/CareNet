/**
 * Notification Service
 * Handles sending SMS notifications and other alerts
 */

interface SMSProvider {
  sendSMS(to: string, message: string): Promise<boolean>;
}

// Mock SMS provider for development
class MockSMSProvider implements SMSProvider {
  async sendSMS(to: string, message: string): Promise<boolean> {
    console.log(`[MOCK SMS] To: ${to}, Message: ${message}`);
    // In production, integrate with actual SMS provider like Twilio, Vonage, etc.
    return true;
  }
}

// Production SMS provider (example with Twilio)
class TwilioSMSProvider implements SMSProvider {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      // In production, use actual Twilio SDK
      // const twilio = require('twilio')(this.accountSid, this.authToken);
      // await twilio.messages.create({
      //   body: message,
      //   from: this.fromNumber,
      //   to: to,
      // });
      
      console.log(`[TWILIO SMS] To: ${to}, Message: ${message}`);
      return true;
    } catch (error) {
      console.error('Failed to send SMS via Twilio:', error);
      return false;
    }
  }
}

class NotificationService {
  private smsProvider: SMSProvider;

  constructor() {
    // Use mock provider in development, real provider in production
    this.smsProvider = process.env.NODE_ENV === 'production' 
      ? new TwilioSMSProvider() 
      : new MockSMSProvider();
  }

  /**
   * Send OTP verification code
   */
  async sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
    const message = `Your Caregiver Platform verification code is: ${otp}. This code will expire in 10 minutes. Please do not share this code with anyone.`;
    
    return await this.smsProvider.sendSMS(phoneNumber, message);
  }

  /**
   * Send welcome message
   */
  async sendWelcomeMessage(phoneNumber: string, name: string): Promise<boolean> {
    const message = `Welcome to Caregiver Platform, ${name}! Your account has been successfully created. Thank you for joining our community.`;
    
    return await this.smsProvider.sendSMS(phoneNumber, message);
  }

  /**
   * Send appointment reminder
   */
  async sendAppointmentReminder(phoneNumber: string, appointmentDetails: {
    date: string;
    time: string;
    caregiverName: string;
    patientName: string;
  }): Promise<boolean> {
    const message = `Reminder: You have an appointment on ${appointmentDetails.date} at ${appointmentDetails.time}. Caregiver: ${appointmentDetails.caregiverName}, Patient: ${appointmentDetails.patientName}.`;
    
    return await this.smsProvider.sendSMS(phoneNumber, message);
  }

  /**
   * Send payment confirmation
   */
  async sendPaymentConfirmation(phoneNumber: string, paymentDetails: {
    amount: number;
    service: string;
    date: string;
  }): Promise<boolean> {
    const message = `Payment confirmed: BDT ${paymentDetails.amount} for ${paymentDetails.service} on ${paymentDetails.date}. Thank you for using our service.`;
    
    return await this.smsProvider.sendSMS(phoneNumber, message);
  }

  /**
   * Send emergency alert
   */
  async sendEmergencyAlert(phoneNumber: string, emergencyDetails: {
    patientName: string;
    type: string;
    location?: string;
  }): Promise<boolean> {
    const message = `EMERGENCY ALERT: ${emergencyDetails.patientName} - ${emergencyDetails.type}${emergencyDetails.location ? ` at ${emergencyDetails.location}` : ''}. Please respond immediately.`;
    
    return await this.smsProvider.sendSMS(phoneNumber, message);
  }
}

// Singleton instance
const notificationService = new NotificationService();

export default notificationService;

// Helper functions for backward compatibility
export async function sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
  return await notificationService.sendOTP(phoneNumber, otp);
}

export async function sendWelcomeMessage(phoneNumber: string, name: string): Promise<boolean> {
  return await notificationService.sendWelcomeMessage(phoneNumber, name);
}

export async function sendAppointmentReminder(phoneNumber: string, appointmentDetails: {
  date: string;
  time: string;
  caregiverName: string;
  patientName: string;
}): Promise<boolean> {
  return await notificationService.sendAppointmentReminder(phoneNumber, appointmentDetails);
}

export async function sendPaymentConfirmation(phoneNumber: string, paymentDetails: {
  amount: number;
  service: string;
  date: string;
}): Promise<boolean> {
  return await notificationService.sendPaymentConfirmation(phoneNumber, paymentDetails);
}

export async function sendEmergencyAlert(phoneNumber: string, emergencyDetails: {
  patientName: string;
  type: string;
  location?: string;
}): Promise<boolean> {
  return await notificationService.sendEmergencyAlert(phoneNumber, emergencyDetails);
}