import { OtpEmailTemplate } from './email.template.js';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
    async sendMail(to, subject, html) {
        try {
            await resend.emails.send({
                from: `noreply <${process.env.RESEND_FROM_EMAIL}>`,
                to: to,
                subject: subject,
                html: html,
            });
        } catch (error) {
            console.error("Email sending failed:", error);
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