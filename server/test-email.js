import 'dotenv/config';
import nodemailer from 'nodemailer';

const testEmail = async () => {
  console.log('🔍 Testing email configuration...');
  
  // Check environment variables
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
  console.log('CLIENT_URL:', process.env.CLIENT_URL);
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Test connection
    await transporter.verify();
    console.log('✅ Email transporter connected successfully');

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"AI Career Copilot" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: '🧪 Email Test - AI Career Copilot',
      html: `
        <h2>Test Email</h2>
        <p>If you receive this, email configuration is working!</p>
        <p>Client URL: ${process.env.CLIENT_URL}</p>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Fix: Check your Gmail app password');
      console.log('1. Enable 2-Step Verification');
      console.log('2. Generate App Password at: https://myaccount.google.com/apppasswords');
      console.log('3. Use the 16-character password in EMAIL_PASS');
    }
  }
};

testEmail();
