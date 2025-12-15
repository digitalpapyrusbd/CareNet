import { SmsService } from './sms.service';
import twilio from 'twilio';

// Mock Twilio
const mockMessagesCreate = jest.fn();
const mockTwilioClient = {
    messages: {
        create: mockMessagesCreate,
    },
};

jest.mock('twilio', () => jest.fn(() => mockTwilioClient));

describe('SmsService', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    describe('Constructor', () => {
        it('should warn when Twilio credentials are missing', () => {
            delete process.env.TWILIO_ACCOUNT_SID;
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

            new SmsService();

            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('Twilio credentials not configured')
            );
            consoleWarnSpy.mockRestore();
        });

        it('should initialize Twilio when credentials are present', () => {
            process.env.TWILIO_ACCOUNT_SID = 'sid';
            process.env.TWILIO_AUTH_TOKEN = 'token';

            new SmsService();

            expect(twilio).toHaveBeenCalledWith('sid', 'token');
        });
    });

    describe('sendSms', () => {
        let smsService: SmsService;

        beforeEach(() => {
            process.env.TWILIO_ACCOUNT_SID = 'sid';
            process.env.TWILIO_AUTH_TOKEN = 'token';
            process.env.TWILIO_PHONE_NUMBER = '+1234567890';
            smsService = new SmsService();
        });

        it('should send SMS successfully', async () => {
            mockMessagesCreate.mockResolvedValue({ sid: 'MSG123' });

            await smsService.sendSms('+9876543210', 'Hello SMS');

            expect(mockMessagesCreate).toHaveBeenCalledWith({
                body: 'Hello SMS',
                to: '+9876543210',
                from: '+1234567890',
            });
        });

        it('should throw error if client is not initialized', async () => {
            delete process.env.TWILIO_ACCOUNT_SID;
            // Re-initialize to trigger the warning and no client
            const serviceWithoutClient = new SmsService();

            await expect(serviceWithoutClient.sendSms('to', 'body'))
                .rejects.toThrow('Twilio client not initialized');
        });

        it('should log and rethrow errors on send failure', async () => {
            const error = new Error('Twilio error');
            mockMessagesCreate.mockRejectedValue(error);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            await expect(smsService.sendSms('+9876543210', 'Hello'))
                .rejects.toThrow('Twilio error');

            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to send SMS:', error);
            consoleErrorSpy.mockRestore();
        });
    });
});
