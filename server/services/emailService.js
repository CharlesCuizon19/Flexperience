// services/emailService.js
const nodemailer = require('nodemailer');

// Create transporter using Hostinger's SMTP settings
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',  // Hostinger SMTP server
    port: 465,                   // Use 587 if you're using TLS or STARTTLS
    secure: true,                // Set to false if using TLS or STARTTLS (587)
    auth: {
        user: process.env.EMAIL_USER,  // Your Hostinger email address from .env
        pass: process.env.EMAIL_PASS,  // Your Hostinger email password from .env
    },
});

/**
 * Sends an email using the transporter.
 * @param {string} to - Recipient's email address
 * @param {string} subject - Subject of the email
 * @param {string} text - Plain text content of the email
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender email from .env
            to,                          // Recipient email
            subject,                     // Email subject
            text,                        // Email body
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('SMTP Error Response:', error.response);
        }
        throw new Error('Failed to send email.');
    }
};

module.exports = { sendEmail };
