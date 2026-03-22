import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const baseEmailTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Career Copilot</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0f; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #13131a; border-radius: 16px; overflow: hidden; border: 1px solid #1e1e2e; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 40px; color: #e2e8f0; }
    .body h2 { color: #f8fafc; font-size: 20px; margin: 0 0 16px; }
    .body p { line-height: 1.7; color: #94a3b8; margin: 0 0 20px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 8px 0; }
    .divider { height: 1px; background: #1e1e2e; margin: 24px 0; }
    .footer { padding: 24px 40px; text-align: center; background: #0d0d14; }
    .footer p { color: #475569; font-size: 12px; margin: 0; }
    .highlight { background: #1e1e2e; border-left: 3px solid #6366f1; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 16px 0; font-family: monospace; color: #a5b4fc; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 AI Career Copilot</h1>
      <p>Your AI-powered career assistant</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} AI Career Copilot. All rights reserved.</p>
      <p style="margin-top: 8px;">If you didn't request this email, you can safely ignore it.</p>
    </div>
  </div>
</body>
</html>
`;

export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const transporter = createTransporter();

  const content = `
    <h2>Welcome aboard, ${name}! 🎉</h2>
    <p>Thanks for signing up. To start using AI Career Copilot, please verify your email address by clicking the button below.</p>
    <a href="${verifyUrl}" class="btn">Verify Email Address</a>
    <div class="divider"></div>
    <p style="font-size: 13px;">Or copy and paste this link in your browser:</p>
    <div class="highlight">${verifyUrl}</div>
    <p style="font-size: 12px; color: #64748b;">This link expires in 24 hours.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"AI Career Copilot" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✅ Verify Your Email – AI Career Copilot',
    html: baseEmailTemplate(content),
  });
};

export const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();

  const content = `
    <h2>You're all set, ${name}! 🚀</h2>
    <p>Your email has been verified. Welcome to AI Career Copilot — your intelligent career assistant.</p>
    <p>Here's what you can do:</p>
    <ul style="color: #94a3b8; line-height: 2;">
      <li>📄 <strong style="color: #e2e8f0;">Analyze your resume</strong> with AI feedback</li>
      <li>🎯 <strong style="color: #e2e8f0;">Match against job descriptions</strong> and get a compatibility score</li>
      <li>✉️ <strong style="color: #e2e8f0;">Generate cover letters</strong> tailored to any job</li>
      <li>🎤 <strong style="color: #e2e8f0;">Prepare for interviews</strong> with AI-generated questions</li>
    </ul>
    <a href="${process.env.CLIENT_URL}/dashboard" class="btn">Go to Dashboard</a>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"AI Career Copilot" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 Welcome to AI Career Copilot!',
    html: baseEmailTemplate(content),
  });
};

export const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const transporter = createTransporter();

  const content = `
    <h2>Reset your password</h2>
    <p>Hi ${name}, we received a request to reset your password. Click the button below to create a new one.</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <div class="divider"></div>
    <p style="font-size: 13px;">Or copy and paste this link:</p>
    <div class="highlight">${resetUrl}</div>
    <p style="font-size: 12px; color: #64748b;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"AI Career Copilot" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Reset Your Password – AI Career Copilot',
    html: baseEmailTemplate(content),
  });
};
