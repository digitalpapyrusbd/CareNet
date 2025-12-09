import { PushService } from './push.service';
import * as admin from 'firebase-admin';

const mockMessaging = {
    send: jest.fn(),
};

jest.mock('firebase-admin', () => ({
    apps: [],
    initializeApp: jest.fn(),
    credential: {
        cert: jest.fn(),
    },
    messaging: jest.fn(() => mockMessaging),
}));

describe('PushService', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv };
        // Reset apps array
        (admin.apps as any).length = 0;
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    describe('Constructor', () => {
        it('should warn when FIREBASE_SERVICE_ACCOUNT_KEY is missing', () => {
            delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

            new PushService();

            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('Firebase service account key not configured')
            );
            consoleWarnSpy.mockRestore();
        });

        it('should warn when FIREBASE_SERVICE_ACCOUNT_KEY is invalid JSON', () => {
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY = 'invalid-json';
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

            new PushService();

            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('Invalid Firebase service account key')
            );
            consoleWarnSpy.mockRestore();
        });

        it('should initialize Firebase when key is valid', () => {
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY = JSON.stringify({ project_id: 'test' });

            new PushService();

            expect(admin.initializeApp).toHaveBeenCalled();
            expect(admin.credential.cert).toHaveBeenCalled();
        });

        it('should not re-initialize if already initialized', () => {
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY = JSON.stringify({ project_id: 'test' });
            // Simulate existing app
            (admin.apps as any).push({});

            new PushService();

            expect(admin.initializeApp).not.toHaveBeenCalled();
        });
    });

    describe('sendPushNotification', () => {
        let pushService: PushService;

        beforeEach(() => {
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY = JSON.stringify({ project_id: 'test' });
            pushService = new PushService();
        });

        it('should send push notification successfully', async () => {
            mockMessaging.send.mockResolvedValue('message-id');

            await pushService.sendPushNotification('token123', 'Title', 'Body', { key: 'value' });

            expect(mockMessaging.send).toHaveBeenCalledWith({
                token: 'token123',
                notification: {
                    title: 'Title',
                    body: 'Body',
                },
                data: { key: 'value' },
            });
        });

        it('should log and rethrow errors on send failure', async () => {
            const error = new Error('Firebase error');
            mockMessaging.send.mockRejectedValue(error);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            await expect(pushService.sendPushNotification('token', 'Title', 'Body'))
                .rejects.toThrow('Firebase error');

            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to send push notification:', error);
            consoleErrorSpy.mockRestore();
        });
    });
});
