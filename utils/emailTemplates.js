/**
 * Email Templates for Seth Shoes Station
 * Responsive HTML templates for welcome and login notification emails
 */

/**
 * Get welcome email template
 * @param {string} userFullName - User's full name
 * @returns {string} - HTML email template
 */
function getWelcomeEmailTemplate(userFullName) {
  const displayName = userFullName.split(' ')[0]; // Get first name

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Seth Shoes Station</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #0a0e27;
          color: #e0e0e0;
          line-height: 1.6;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(135deg, #1a1f3a 0%, #0f1428 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }
        
        .header p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #19e445;
          margin-bottom: 20px;
        }
        
        .message {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 24px;
          line-height: 1.8;
        }
        
        .benefits-section {
          background: rgba(102, 126, 234, 0.05);
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 30px 0;
          border-radius: 4px;
        }
        
        .benefits-section h3 {
          font-size: 14px;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .benefits-list {
          list-style: none;
          padding: 0;
        }
        
        .benefits-list li {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
          padding-left: 24px;
          position: relative;
        }
        
        .benefits-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #19e445;
          font-weight: bold;
        }
        
        .cta-button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          margin-top: 24px;
          margin-bottom: 24px;
          transition: transform 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
        }
        
        .footer {
          background: rgba(255, 255, 255, 0.03);
          padding: 30px;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .footer-text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 12px;
        }
        
        .social-links {
          margin-top: 20px;
        }
        
        .social-link {
          display: inline-block;
          width: 32px;
          height: 32px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 50%;
          text-align: center;
          line-height: 32px;
          margin: 0 6px;
          text-decoration: none;
          color: #667eea;
          font-weight: bold;
        }
        
        .social-link:hover {
          background: rgba(102, 126, 234, 0.2);
        }
        
        .divider {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin: 24px 0;
        }
        
        @media (max-width: 600px) {
          .email-container {
            border-radius: 0;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .header h1 {
            font-size: 24px;
          }
          
          .message {
            font-size: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <h1>🎉 Welcome to Seth Shoes Station</h1>
          <p>Your Account is Ready!</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
          <div class="greeting">Hi ${displayName},</div>
          
          <p class="message">
            Thank you for joining Seth Shoes Station! We're thrilled to have you as part of our community. Your account has been successfully created, and you're all set to start shopping for premium kicks and street-ready essentials.
          </p>
          
          <p class="message">
            Discover our curated collection of high-quality footwear, tops, and bottoms designed for the modern urbanite. Whether you're looking for classic styles or the latest trends, we've got something for everyone.
          </p>
          
          <div class="benefits-section">
            <h3>What's Next?</h3>
            <ul class="benefits-list">
              <li>Browse our exclusive collection of premium products</li>
              <li>Get notified about new arrivals and special offers</li>
              <li>Track your orders with our easy order management</li>
              <li>Enjoy fast and secure checkout</li>
              <li>Access your personalized shopping profile</li>
            </ul>
          </div>
          
          <hr class="divider">
          
          <p class="message">
            If you have any questions or need assistance, our customer support team is here to help. Feel free to reach out to us at <strong>hello@sethshoesstation.com</strong>.
          </p>
          
          <p class="message">
            Happy shopping!<br>
            <strong>The Seth Shoes Station Team</strong>
          </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p class="footer-text">Seth Shoes Station © 2024. All rights reserved.</p>
          <p class="footer-text">🏪 MC Arthur Highway, Población, Mabalacat City, Pampanga</p>
          <div class="social-links">
            <a href="https://www.facebook.com/sethshoesstation" class="social-link" title="Facebook">f</a>
            <a href="https://www.instagram.com/sethshoesstation" class="social-link" title="Instagram">📷</a>
            <a href="https://www.tiktok.com/@sethshoesstation" class="social-link" title="TikTok">♪</a>
          </div>
          <p class="footer-text" style="margin-top: 16px;">
            <a href="https://sethshoesstation.com/unsubscribe" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
            <a href="https://sethshoesstation.com/privacy" style="color: #667eea; text-decoration: none;">Privacy Policy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Get login notification email template
 * @param {string} userFullName - User's full name
 * @param {Object} loginInfo - Login information (time, device, IP)
 * @returns {string} - HTML email template
 */
function getLoginEmailTemplate(userFullName, loginInfo = {}) {
  const displayName = userFullName.split(' ')[0];
  const loginTime = loginInfo.loginTime || new Date().toLocaleString();
  const deviceInfo = loginInfo.deviceInfo || 'Unknown Device';
  const ipAddress = loginInfo.ipAddress || 'Unknown IP';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Login - Seth Shoes Station</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #0a0e27;
          color: #e0e0e0;
          line-height: 1.6;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(135deg, #1a1f3a 0%, #0f1428 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        
        .header {
          background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%);
          padding: 40px 20px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }
        
        .header p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #19e445;
          margin-bottom: 20px;
        }
        
        .alert-message {
          background: rgba(255, 152, 0, 0.08);
          border-left: 4px solid #ffa726;
          padding: 16px;
          margin-bottom: 24px;
          border-radius: 4px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
        }
        
        .message {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 24px;
          line-height: 1.8;
        }
        
        .login-details {
          background: rgba(102, 126, 234, 0.05);
          border: 1px solid rgba(102, 126, 234, 0.2);
          padding: 24px;
          margin: 24px 0;
          border-radius: 8px;
        }
        
        .login-details h3 {
          font-size: 14px;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 14px;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
        }
        
        .detail-value {
          color: rgba(255, 255, 255, 0.85);
          text-align: right;
          word-break: break-word;
        }
        
        .action-needed {
          background: rgba(244, 67, 54, 0.08);
          border: 1px solid rgba(244, 67, 54, 0.2);
          padding: 16px;
          margin: 24px 0;
          border-radius: 4px;
          border-left: 4px solid #f44336;
        }
        
        .action-needed h4 {
          color: #f44336;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .action-needed p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.6;
        }
        
        .cta-button {
          display: inline-block;
          padding: 12px 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          margin-top: 8px;
          transition: transform 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
        }
        
        .footer {
          background: rgba(255, 255, 255, 0.03);
          padding: 30px;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .footer-text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 12px;
        }
        
        .divider {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin: 24px 0;
        }
        
        @media (max-width: 600px) {
          .email-container {
            border-radius: 0;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .header h1 {
            font-size: 24px;
          }
          
          .message {
            font-size: 15px;
          }
          
          .detail-row {
            flex-direction: column;
          }
          
          .detail-value {
            text-align: left;
            margin-top: 4px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <h1>🔐 New Login Detected</h1>
          <p>Seth Shoes Station Account Activity</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
          <div class="greeting">Hi ${displayName},</div>
          
          <div class="alert-message">
            ⚠️ A new login to your Seth Shoes Station account was detected. Please review the details below.
          </div>
          
          <p class="message">
            This is a security notification to help keep your account safe. If this login was authorized by you, you can ignore this message. If you didn't initiate this login, please secure your account immediately.
          </p>
          
          <!-- Login Details -->
          <div class="login-details">
            <h3>Login Details</h3>
            <div class="detail-row">
              <span class="detail-label">📅 Date & Time</span>
              <span class="detail-value">${loginTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">💻 Device</span>
              <span class="detail-value">${deviceInfo}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🌐 IP Address</span>
              <span class="detail-value">${ipAddress}</span>
            </div>
          </div>
          
          <hr class="divider">
          
          <!-- Action Needed -->
          <div class="action-needed">
            <h4>Didn't Recognize This Login?</h4>
            <p>
              If you don't recognize this login or believe your account has been compromised, please take immediate action:
            </p>
            <a href="https://sethshoesstation.com/change-password" class="cta-button">Change Password</a>
          </div>
          
          <p class="message">
            For additional account security options or if you need further assistance, please contact our support team at <strong>hello@sethshoesstation.com</strong>.
          </p>
          
          <p class="message">
            Best regards,<br>
            <strong>The Seth Shoes Station Security Team</strong>
          </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p class="footer-text">Seth Shoes Station © 2024. All rights reserved.</p>
          <p class="footer-text">This is an automated security notification. Do not reply to this email.</p>
          <p class="footer-text" style="margin-top: 16px;">
            <a href="https://sethshoesstation.com/privacy" style="color: #667eea; text-decoration: none;">Privacy Policy</a> | 
            <a href="https://sethshoesstation.com/security" style="color: #667eea; text-decoration: none;">Security</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
  getWelcomeEmailTemplate,
  getLoginEmailTemplate
};
