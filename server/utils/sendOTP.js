const nodemailer = require("nodemailer")
const OTP = require("../models/OTP")

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP via email
const sendOTP = async (email) => {
  try {
    // Generate OTP
    const otp = generateOTP()

    // Save OTP to database first
    try {
      await OTP.findOneAndDelete({ email }) // Delete any existing OTP
      await OTP.create({ email, otp })
    } catch (dbError) {
      console.error('Database error while saving OTP:', dbError);
      throw new Error('Failed to save OTP');
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('Email transporter verification failed:', verifyError);
      throw new Error('Email service not configured properly');
    }

    // Email content
    const mailOptions = {
      from: `"Gift Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Gift Platform Registration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a4a4a;">Verify Your Email</h2>
          <p>Thank you for registering with our Gift Platform. Please use the following OTP to complete your registration:</p>
          <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>Gift Platform Team</p>
        </div>
      `
    }

    // Send email
    try {
      await transporter.sendMail(mailOptions)
      console.log('OTP sent successfully to:', email);
      return true;
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // If email fails, delete the OTP from database
      await OTP.findOneAndDelete({ email });
      throw new Error('Failed to send OTP email');
    }
  } catch (error) {
    console.error("Error in sendOTP:", error);
    return false;
  }
}

module.exports = { sendOTP }
