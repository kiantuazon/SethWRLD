const nodemailer = require('nodemailer');
const { getWelcomeEmailTemplate, getLoginEmailTemplate } = require('../utils/emailTemplates');

/**
 * Email Service for Seth Shoes Station
 * Handles sending welcome emails, login notifications, and other communications
 */

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.isTestAccount = false;
    this.initializeTransporter();
  }

  /**
   * Initialize the email transporter with credentials from environment variables
   */
  async initializeTransporter() {
    try {
      const user = process.env.EMAIL_USER && process.env.EMAIL_USER.trim();
      const pass = process.env.EMAIL_PASSWORD && process.env.EMAIL_PASSWORD.trim();

      if (!user || !pass) {
        // In production, require explicit credentials. In development, create a test account so emails can be inspected.
        if (process.env.NODE_ENV === 'production') {
          console.error('✗ Email service configuration missing: set EMAIL_USER and EMAIL_PASSWORD in .env');
          this.initialized = false;
          return;
        }

        console.warn('⚠ Email credentials not provided — creating a Ethereal test account for development.');
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        this.isTestAccount = true;
        this.initialized = true;
        console.log('✓ Email service initialized with Ethereal test account (development mode)');
        console.log('  Preview URL will be shown in logs after sending a test email');
        return;
      }

      // Support multiple email providers
      if (process.env.EMAIL_SERVICE === 'gmail') {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user,
            pass
          }
        });
      } else if (process.env.EMAIL_SERVICE === 'smtp') {
        if (!process.env.SMTP_HOST) {
          console.error('✗ SMTP configuration missing: set SMTP_HOST in .env');
          this.initialized = false;
          return;
        }

        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user,
            pass
          }
        });
      } else {
        // Fallback to Gmail
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user,
            pass
          }
        });
      }

      this.initialized = !!this.transporter;
      
      if (this.initialized) {
        console.log('✓ Email service initialized successfully');
      }
    } catch (error) {
      console.error('✗ Failed to initialize email service:', error.message);
      if (error && /Missing credentials for \"PLAIN\"/i.test(error.message)) {
        console.error('  → Suggestion: For Gmail, enable 2FA and use an App Password (myaccount.google.com/apppasswords)');
      }
      this.initialized = false;
    }
  }

  /**
   * Verify email configuration (optional - useful for debugging)
   */
  async verifyTransporter() {
    if (!this.transporter) {
      console.warn('Email transporter not initialized');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✓ Email transporter verified');
      return true;
    } catch (error) {
      console.error('✗ Email transporter verification failed:', error.message);
      return false;
    }
  }

  /**
   * Send welcome email to new user
   * @param {string} userEmail - User's email address
   * @param {string} userFullName - User's full name
   * @returns {Promise<Object>} - Email send result
   */
  async sendWelcomeEmail(userEmail, userFullName) {
    if (!this.initialized) {
      console.warn('Email service not initialized. Skipping welcome email.');
      return { success: false, error: 'Email service not available' };
    }

    try {
      const emailHtml = getWelcomeEmailTemplate(userFullName);
      
      const mailOptions = {
        from: `"Seth Shoes Station" <${process.env.EMAIL_USER}>`,
        replyTo: userEmail,
        to: userEmail,
        subject: 'Welcome to Seth Shoes Station!',
        html: emailHtml,
        text: `Welcome to Seth Shoes Station, ${userFullName}! Your account has been created successfully.`
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`✓ Welcome email sent to ${userEmail} (Message ID: ${result.messageId})`);
      if (this.isTestAccount) {
        const preview = nodemailer.getTestMessageUrl(result);
        if (preview) console.log(`  Preview URL: ${preview}`);
      }
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(`✗ Failed to send welcome email to ${userEmail}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send login notification email to user
   * @param {string} userEmail - User's email address
   * @param {string} userFullName - User's full name
   * @param {Object} loginInfo - Additional login information (device, time, location, etc.)
   * @returns {Promise<Object>} - Email send result
   */
  async sendLoginNotificationEmail(userEmail, userFullName, loginInfo = {}) {
    if (!this.initialized) {
      console.warn('Email service not initialized. Skipping login notification email.');
      return { success: false, error: 'Email service not available' };
    }

    try {
      const loginTime = loginInfo.timestamp || new Date().toLocaleString();
      const deviceInfo = loginInfo.deviceInfo || 'Unknown Device';
      const ipAddress = loginInfo.ipAddress || 'Unknown IP';

      const emailHtml = getLoginEmailTemplate(userFullName, {
        loginTime,
        deviceInfo,
        ipAddress
      });

      const mailOptions = {
        from: `"Seth Shoes Station" <${process.env.EMAIL_USER}>`,
        replyTo: userEmail,
        to: userEmail,
        subject: 'New Login Detected - Seth Shoes Station',
        html: emailHtml,
        text: `New login detected on your Seth Shoes Station account at ${loginTime}. If this wasn't you, please secure your account immediately.`
      };

      const result = await this.transporter.sendMail(mailOptions);

      console.log(`✓ Login notification email sent to ${userEmail} (Message ID: ${result.messageId})`);
      if (this.isTestAccount) {
        const preview = nodemailer.getTestMessageUrl(result);
        if (preview) console.log(`  Preview URL: ${preview}`);
      }
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(`✗ Failed to send login notification email to ${userEmail}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send generic email (reusable for other notifications)
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} htmlContent - HTML email content
   * @param {string} textContent - Plain text fallback
   * @returns {Promise<Object>} - Email send result
   */
  async sendGenericEmail(to, subject, htmlContent, textContent = '') {
    if (!this.initialized) {
      console.warn('Email service not initialized. Skipping email.');
      return { success: false, error: 'Email service not available' };
    }

    try {
      const mailOptions = {
        from: `"Seth Shoes Station" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
        text: textContent
      };

      const result = await this.transporter.sendMail(mailOptions);

      console.log(`✓ Email sent to ${to} (Message ID: ${result.messageId})`);
      if (this.isTestAccount) {
        const preview = nodemailer.getTestMessageUrl(result);
        if (preview) console.log(`  Preview URL: ${preview}`);
      }
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(`✗ Failed to send email to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send email to multiple recipients (bulk)
   * @param {Array<string>} recipients - Array of email addresses
   * @param {string} subject - Email subject
   * @param {string} htmlContent - HTML email content
   * @returns {Promise<Object>} - Results for all emails
   */
  async sendBulkEmail(recipients, subject, htmlContent) {
    if (!this.initialized) {
      console.warn('Email service not initialized. Skipping bulk email.');
      return { success: false, error: 'Email service not available' };
    }

    try {
      const results = await Promise.allSettled(
        recipients.map(email =>
          this.sendGenericEmail(email, subject, htmlContent)
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failed = results.filter(r => r.status === 'rejected' || !r.value.success).length;

      console.log(`✓ Bulk email sent: ${successful} successful, ${failed} failed`);
      return {
        success: failed === 0,
        successful,
        failed,
        results
      };
    } catch (error) {
      console.error('✗ Failed to send bulk email:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get the current status of email service
   */
  getStatus() {
    return {
      initialized: this.initialized,
      serviceProvider: process.env.EMAIL_SERVICE || 'gmail',
      sender: process.env.EMAIL_USER || 'Not configured'
    };
  }
}

// Export singleton instance
module.exports = new EmailService();
