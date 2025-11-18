import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  private client: twilio.Twilio;
  private fromNumber: string;
  private rateLimits: Map<string, number[]> = new Map();

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';

    if (accountSid && authToken) {
      this.client = twilio.default(accountSid, authToken);
    } else {
      console.warn('Twilio credentials not configured. SMS sending will be mocked.');
    }
  }

  /**
   * Validate Bangladesh phone number format
   */
  private validatePhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Check if it starts with 880 (country code)
    if (digits.startsWith('880')) {
      return `+${digits}`;
    }

    // Check if it starts with 01 (local format)
    if (digits.startsWith('01') && digits.length === 11) {
      return `+880${digits.slice(1)}`;
    }

    // Check if it's just the number without country code or 0
    if (digits.startsWith('1') && digits.length === 10) {
      return `+880${digits}`;
    }

    throw new Error('Invalid Bangladesh phone number format');
  }

  /**
   * Check rate limit: 5 SMS per hour per number
   */
  private checkRateLimit(phone: string): boolean {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    // Get existing timestamps for this number
    const timestamps = this.rateLimits.get(phone) || [];

    // Filter out timestamps older than 1 hour
    const recentTimestamps = timestamps.filter(ts => ts > oneHourAgo);

    // Check if limit exceeded
    if (recentTimestamps.length >= 5) {
      return false;
    }

    // Add current timestamp and update map
    recentTimestamps.push(now);
    this.rateLimits.set(phone, recentTimestamps);

    return true;
  }

  /**
   * Send OTP code via SMS
   */
  async sendOTP(phone: string, code: string): Promise<void> {
    const validatedPhone = this.validatePhoneNumber(phone);

    // Check rate limit
    if (!this.checkRateLimit(validatedPhone)) {
      throw new Error('SMS rate limit exceeded. Maximum 5 SMS per hour.');
    }

    const message = `Your CaregiverBD verification code is: ${code}. This code will expire in 10 minutes. Do not share this code with anyone.`;

    if (!this.client) {
      console.log(`[MOCK SMS] To: ${validatedPhone}, Message: ${message}`);
      return;
    }

    try {
      await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: validatedPhone,
      });
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error('Failed to send SMS notification');
    }
  }

  /**
   * Send job notification
   */
  async sendJobNotification(phone: string, jobDetails: {
    jobId: string;
    patientName: string;
    startTime: string;
    location: string;
  }): Promise<void> {
    const validatedPhone = this.validatePhoneNumber(phone);

    // Check rate limit
    if (!this.checkRateLimit(validatedPhone)) {
      throw new Error('SMS rate limit exceeded. Maximum 5 SMS per hour.');
    }

    const message = `New job assigned! Patient: ${jobDetails.patientName}. Time: ${jobDetails.startTime}. Location: ${jobDetails.location}. Job ID: ${jobDetails.jobId}`;

    if (!this.client) {
      console.log(`[MOCK SMS] To: ${validatedPhone}, Message: ${message}`);
      return;
    }

    try {
      await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: validatedPhone,
      });
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error('Failed to send SMS notification');
    }
  }

  /**
   * Send payment confirmation
   */
  async sendPaymentConfirmation(phone: string, amount: number, transactionId: string): Promise<void> {
    const validatedPhone = this.validatePhoneNumber(phone);

    // Check rate limit
    if (!this.checkRateLimit(validatedPhone)) {
      throw new Error('SMS rate limit exceeded. Maximum 5 SMS per hour.');
    }

    const message = `Payment successful! Amount: BDT ${amount.toFixed(2)}. Transaction ID: ${transactionId}. Thank you for using CaregiverBD.`;

    if (!this.client) {
      console.log(`[MOCK SMS] To: ${validatedPhone}, Message: ${message}`);
      return;
    }

    try {
      await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: validatedPhone,
      });
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error('Failed to send SMS notification');
    }
  }

  /**
   * Send generic SMS
   */
  async sendSMS(phone: string, message: string): Promise<void> {
    const validatedPhone = this.validatePhoneNumber(phone);

    // Check rate limit
    if (!this.checkRateLimit(validatedPhone)) {
      throw new Error('SMS rate limit exceeded. Maximum 5 SMS per hour.');
    }

    if (!this.client) {
      console.log(`[MOCK SMS] To: ${validatedPhone}, Message: ${message}`);
      return;
    }

    try {
      await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: validatedPhone,
      });
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error('Failed to send SMS notification');
    }
  }
}
