const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send password change notification email
const sendPasswordChangeEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Change Notification',
      html: `
        <h1>Password Change Notification</h1>
        <p>Your password has been successfully changed.</p>
        <p>If you did not make this change, please contact support immediately.</p>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending password change email:', error);
    return false;
  }
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const sendVerificationEmail = async (email, token) => {
  // For now, just log the verification token
  console.log(`Verification token for ${email}: ${token}`);
  return true;
};

module.exports = {
  sendPasswordChangeEmail,
  generateVerificationToken,
  sendVerificationEmail
}; 