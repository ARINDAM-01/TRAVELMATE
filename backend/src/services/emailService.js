const nodemailer = require('nodemailer');
const config = require('../config');

const sendPasswordResetEmail = async (email, resetUrl) => {
  if (!config.smtpHost || !config.smtpUser || !config.smtpPassword || !config.smtpFrom) {
    throw new Error('SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM must be configured');
  }

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure || config.smtpPort === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword,
    },
  });

  await transporter.sendMail({
    from: config.smtpFrom,
    to: email,
    subject: 'Reset your TravelMate password',
    text: `Use this link within one hour to reset your TravelMate password: ${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Use this link within one hour to reset your TravelMate password:</p><p><a href="${resetUrl}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  });
};

module.exports = { sendPasswordResetEmail };
