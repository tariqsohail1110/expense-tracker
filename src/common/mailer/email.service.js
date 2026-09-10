import { OtpEmailTemplate } from './email.template.js';
import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

export class EmailService {
    async sendMail(to, subject, html) {
        try {
            await brevo.transactionalEmails.sendTransacEmail({
                sender: { name: 'noreply', email: process.env.BREVO_FROM_EMAIL },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html,
            });
        } catch (error) {
            console.error('Email sending failed:', error?.response?.body ?? error);
            throw error;
        }
    }

    async sendOtpEmail(email, otp, expiresIn) {
        const bodyTemplate = OtpEmailTemplate({
            otpCode: otp,
            expiresIn: expiresIn,
        });
        await this.sendMail(
            email,
            'Your requested OTP code',
            bodyTemplate,
        );
    }
}