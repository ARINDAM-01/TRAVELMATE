const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const pass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: port ? parseInt(port, 10) : 587,
      secure: port === '465',
      auth: { user, pass },
    });
  } else if (user && pass) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }
  return transporter;
};

/**
 * Send an OTP verification email to any user account (Gmail, Yahoo, Outlook, custom domain)
 */
const sendOtpEmail = async ({ to, otp, purpose = 'login' }) => {
  const isRegister = purpose === 'register';
  const subject = isRegister
    ? '✨ Your TravelMate Account Verification Code'
    : '🔑 Your TravelMate One-Time Sign-In Code';

  const actionText = isRegister
    ? 'creating your TravelMate account'
    : 'signing in to your TravelMate account';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #07090E; color: #FFFFFF; margin: 0; padding: 20px; }
          .container { max-width: 520px; margin: 0 auto; background: #0E1118; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 36px 28px; text-align: center; }
          .logo { font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin-bottom: 24px; }
          .logo span { color: #F59E0B; }
          .title { font-size: 20px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px; }
          .desc { font-size: 14px; color: #94A3B8; line-height: 1.6; margin-bottom: 28px; }
          .otp-box { background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 18px 24px; display: inline-block; margin-bottom: 28px; }
          .otp-code { font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #F59E0B; font-family: monospace; }
          .footer { font-size: 12px; color: #64748B; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">✈️ Travel<span>Mate</span></div>
          <div class="title">Verification Code</div>
          <div class="desc">
            You requested a one-time verification code for ${actionText}. Use the code below to complete verification:
          </div>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <div class="desc">
            This code will expire in <strong>10 minutes</strong>. If you did not request this code, you can safely ignore this email.
          </div>
          <div class="footer">
            TravelMate Security Team • Protect your account by never sharing this code.
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: `"TravelMate Security" <${process.env.GMAIL_USER || 'no-reply@travelmate.com'}>`,
    to,
    subject,
    html: htmlContent,
  };

  const activeTransporter = getTransporter();

  if (activeTransporter) {
    try {
      await activeTransporter.sendMail(mailOptions);
      console.log(`[EmailService] OTP email sent successfully to ${to}`);
      return { sent: true };
    } catch (err) {
      console.error(`[EmailService] Failed to send email via Gmail SMTP:`, err.message);
      // Fallback log so testing never blocks
      console.log(`[EmailService DEV FALLBACK] OTP for ${to} (${purpose}): [ ${otp} ]`);
      return { sent: false, error: err.message, fallbackOtp: otp };
    }
  } else {
    // If GMAIL_USER is not configured in .env yet, log the OTP clearly in server logs
    console.log(`\n======================================================`);
    console.log(`🔔 [TravelMate Gmail OTP Service - Development Mode]`);
    console.log(`To: ${to}`);
    console.log(`Purpose: ${purpose.toUpperCase()}`);
    console.log(`Verification OTP: >>> ${otp} <<<`);
    console.log(`(Expires in 10 minutes)`);
    console.log(`Tip: Add GMAIL_USER and GMAIL_APP_PASSWORD to backend/.env to send real emails.`);
    console.log(`======================================================\n`);
    return { sent: true, devMode: true, fallbackOtp: otp };
  }
};

module.exports = {
  sendOtpEmail,
};
