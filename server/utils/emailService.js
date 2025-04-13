const nodemailer = require('nodemailer');

// Create transporter object using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send order status update email
const sendOrderStatusUpdate = async (order, customer) => {
  const statusMessages = {
    processing: 'Your order is now being processed',
    completed: 'Your order has been completed',
    cancelled: 'Your order has been cancelled',
  };

  const message = statusMessages[order.status] || 'Your order status has been updated';
  const trackingInfo = order.trackingNumber ? `\nTracking Number: ${order.trackingNumber}` : '';

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: customer.email,
    subject: `Order Status Update - Order #${order._id}`,
    text: `Dear ${customer.name},\n\n${message}${trackingInfo}\n\nOrder Details:\nOrder ID: ${order._id}\nStatus: ${order.status}\nTotal Amount: $${order.totalAmount.toFixed(2)}\n\nThank you for shopping with us!\n\nBest regards,\nThe Gift Platform Team`,
    html: `
      <h2>Order Status Update</h2>
      <p>Dear ${customer.name},</p>
      <p>${message}</p>
      ${trackingInfo ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
      <h3>Order Details</h3>
      <ul>
        <li><strong>Order ID:</strong> ${order._id}</li>
        <li><strong>Status:</strong> ${order.status}</li>
        <li><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</li>
      </ul>
      <p>Thank you for shopping with us!</p>
      <p>Best regards,<br>The Gift Platform Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to ${customer.email}`);
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
};

module.exports = {
  sendOrderStatusUpdate,
}; 