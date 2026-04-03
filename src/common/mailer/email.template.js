export function OtpEmailTemplate(data) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        </head>
        <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 20px;">
            <tr>
            <td align="center">
                <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e0e0e0;">
                
                <!-- Header -->
                <tr>
                    <td style="background:#1D9E75;padding:32px 32px 24px;">
                    <p style="margin:0;font-size:18px;font-weight:500;color:#E1F5EE;">Expense Tracker</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#9FE1CB;">Security Verification</p>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding:32px;">
                    <p style="font-size:15px;color:#111;margin:0 0 8px;">Hello,</p>
                    <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 24px;">
                        We received a request to verify your identity. Use the one-time password below to continue.
                    </p>

                    <!-- OTP Box -->
                    <div style="background:#E1F5EE;border:1px solid #5DCAA5;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
                        <p style="margin:0 0 6px;font-size:12px;color:#0F6E56;letter-spacing:1px;text-transform:uppercase;">Your OTP code</p>
                        <p style="margin:0;font-size:36px;font-weight:500;color:#085041;letter-spacing:10px;">${data.otpCode}</p>
                    </div>

                    <!-- Expiry Notice -->
                    <div style="background:#f9f9f9;border-radius:8px;padding:12px 16px;margin:0 0 24px;display:flex;align-items:center;gap:8px;">
                        <p style="margin:0;font-size:13px;color:#666;">
                        This code expires in <strong style="color:#111;">${data.expiresIn} minutes</strong>. Do not share it with anyone.
                        </p>
                    </div>

                    <p style="font-size:13px;color:#777;line-height:1.7;margin:0;">
                        If you did not request this code, you can safely ignore this email. Your account remains secure.
                    </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="border-top:1px solid #eee;padding:16px 32px;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#999;">This is an automated message — please do not reply.</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#999;">© 2026 Expense Tracker. All rights reserved.</p>
                    </td>
                </tr>

                </table>
            </td>
            </tr>
        </table>

        </body>
        </html>`;
}