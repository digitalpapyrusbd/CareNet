import { EmailService } from './email.service';
import sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail', () => ({
    setApiKey: jest.fn(),
    send: jest.fn(),
}));

describe('EmailService', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    describe('Constructor', () => {
        it('should warn when SENDGRID_API_KEY is missing', () => {
            delete process.env.SENDGRID_API_KEY;
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
            new EmailService();
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('SendGrid API key not configured')
            );
            consoleWarnSpy.mockRestore();
        });

        it('should initialize SendGrid when API key is present', () => {
            process.env.SENDGRID_API_KEY = 'test-key';
            new EmailService();
            expect(sgMail.setApiKey).toHaveBeenCalledWith('test-key');
        });
    });

    describe('sendEmail', () => {
        let emailService: EmailService;

        beforeEach(() => {
            process.env.SENDGRID_API_KEY = 'test-key';
            emailService = new EmailService();
        });

        it('should send email successfully', async () => {
            (sgMail.send as jest.Mock).mockResolvedValue([{ statusCode: 202, body: {} }]);

            await emailService.sendEmail('test@example.com', 'Test Subject', 'Hello World');

            expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
                to: 'test@example.com',
                subject: 'Test Subject',
                html: 'Hello World'
            }));
        });

        it('should log and rethrow errors on send failure', async () => {
            const error = new Error('SendGrid error');
            (sgMail.send as jest.Mock).mockRejectedValue(error);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            await expect(emailService.sendEmail('test@example.com', 'Subject', 'Body'))
                .rejects.toThrow('SendGrid error');

            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to send email:', error);
            consoleErrorSpy.mockRestore();
        });

        it('should render templates with variables', async () => {
            (sgMail.send as jest.Mock).mockResolvedValue([{ statusCode: 202 }]);

            await emailService.sendEmail(
                'test@example.com',
                'Welcome',
                'Hello {{name}}!',
                { name: 'John' }
            );

            expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
                html: 'Hello John!'
            }));
        });
    });
});
