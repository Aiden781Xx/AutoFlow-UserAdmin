import nodemailer from 'nodemailer';
import { config as env } from './env.js';

let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify().then(() => {
    console.log('✅ Mailer configured');
  }).catch((err) => {
    console.warn('⚠️ Mailer verification failed:', err.message);
    transporter = null;
  });
} else {
  console.log('ℹ️ Mailer not configured (EMAIL_USER/EMAIL_PASS missing)');
}

export const sendResetEmail = async ({ to, resetLink }) => {
  if (!transporter) {
    // Mailer not configured — caller should fallback to console logging
    throw new Error('Mailer not configured');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password reset for your account',
    text: `You requested a password reset. Use this link (valid for 15 minutes): ${resetLink}`,
    html: `<p>You requested a password reset. Use this link (valid for 15 minutes):</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  };

  return transporter.sendMail(mailOptions);
};

export default transporter;
