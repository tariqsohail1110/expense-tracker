import { OtpEmailTemplate } from './email.template.js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

dotenv.config();

export class EmailService {
    async sendMail(
        to,
        subject,
        html,
    ) {
        try {
            // await transporter.verify();
            // console.log("Server is ready to take our messages");
            await transporter.sendMail({
                from: `noreply<${process.env.SMTP_USER}>`,
                to: to,
                subject: subject,
                html: html,
            })
        }catch(error) {
            console.error("Verification failed:", error);
        }
    }

    async sendOtpEmail(email, otp, expiresIn) {
        try {
            const bodyTemplate = OtpEmailTemplate({
                otpCode: otp,
                expiresIn: expiresIn,
            });
            await this.sendMail(
                email,
                'Your requested OTP code',
                bodyTemplate,
            )
        }catch(error) {
            throw error;
        }
    }
}