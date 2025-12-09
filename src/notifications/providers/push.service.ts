import * as admin from 'firebase-admin';

export class PushService {
    constructor() {
        if (!admin.apps.length) {
            if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
                try {
                    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                    });
                } catch (error) {
                    console.warn('Invalid Firebase service account key');
                }
            } else {
                console.warn('Firebase service account key not configured');
            }
        }
    }

    async sendPushNotification(token: string, title: string, body: string, data?: Record<string, string>): Promise<void> {
        try {
            await admin.messaging().send({
                token,
                notification: {
                    title,
                    body,
                },
                data,
            });
        } catch (error) {
            console.error('Failed to send push notification:', error);
            throw error;
        }
    }
}
