import { OtpEmailTemplate } from './email.template.js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_SMTP_KEY,
    },
});

export class EmailService {
    async sendMail(to, subject, html) {
        try {
            await transporter.sendMail({
                from: `noreply <${process.env.BREVO_FROM_EMAIL}>`,
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