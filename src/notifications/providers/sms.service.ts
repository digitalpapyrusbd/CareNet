import twilio from 'twilio';

export class SmsService {
    private client: any; // Using any to avoid strict typing issues with the mock in tests, or I could define an interface

    constructor() {
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            console.warn('Twilio credentials not configured');
        } else {
            this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        }
    }

    async sendSms(to: string, body: string): Promise<void> {
        if (!this.client) {
            throw new Error('Twilio client not initialized');
        }

        try {
            await this.client.messages.create({
                body,
                to,
                from: process.env.TWILIO_PHONE_NUMBER,
            });
        } catch (error) {
            console.error('Failed to send SMS:', error);
            throw error;
        }
    }
}
