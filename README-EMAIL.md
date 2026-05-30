# Email Notification System - Setup Guide

Seth Shoes Station now includes a complete email notification system for user registration and login events.

## Features

✅ **Welcome Email** - Automatically sent when a new user registers
✅ **Login Notification Email** - Automatically sent when a user logs in
✅ **Responsive HTML Templates** - Professional, mobile-friendly email designs
✅ **Production-Ready** - Proper error handling and async/await patterns
✅ **Multiple Email Providers** - Support for Gmail and custom SMTP servers
✅ **Security-Focused** - Uses environment variables for credentials

## Setup Instructions

### 1. Install Dependencies

First, install the required packages:

```bash
npm install
```

This will install `nodemailer` (already added to package.json) along with other dependencies.

### 2. Configure Email Service

#### Option A: Using Gmail (Recommended for Testing)

1. Go to your Gmail account settings
2. Enable 2-Factor Authentication (if not already enabled)
3. Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
4. Generate an app-specific password for "Mail" and "Windows Computer"
5. Copy the generated password

#### Option B: Using Custom SMTP Server

Have your SMTP server credentials ready (host, port, username, password)

### 3. Set Environment Variables

Create a `.env` file in the project root (or update existing .env):

#### For Gmail:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

#### For Custom SMTP:
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.yourmailserver.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-smtp-password
```

### 4. Verify Configuration (Optional)

The email service automatically verifies on startup. You should see a message like:
```
✓ Email service initialized successfully
```

If there are issues, check the error message in the console.

## How It Works

### Registration Email Flow

1. User submits registration form with email, full name, and password
2. Account is created in database
3. JWT token is generated
4. **Simultaneously:** Welcome email is sent (non-blocking)
5. Response is sent to client immediately (email sending doesn't delay response)

### Login Email Flow

1. User submits login credentials
2. Credentials are verified
3. JWT token is generated
4. **Simultaneously:** Login notification email is sent with:
   - Login timestamp
   - Device/browser information
   - IP address
5. Response is sent to client immediately

## Email Templates

### Welcome Email
- **Subject:** "Welcome to Seth Shoes Station!"
- **Content:**
  - Personalized greeting
  - Account confirmation
  - Benefits overview
  - Quick start guide
  - Support contact information

### Login Notification Email
- **Subject:** "New Login Detected - Seth Shoes Station"
- **Content:**
  - Security alert notice
  - Login details (time, device, IP)
  - Action items if login not recognized
  - Account security recommendations
  - Support contact information

Both templates are:
- Fully responsive (mobile-friendly)
- Dark theme design (matches brand)
- Professional and secure-focused
- Include company branding and contact info

## File Structure

```
webtech/
├── services/
│   └── emailService.js          # Main email service (singleton)
├── utils/
│   └── emailTemplates.js        # Email HTML templates
├── routes/
│   └── auth.js                  # Updated with email integration
├── .env.example                 # Environment variable template
└── README-EMAIL.md              # This file
```

## Error Handling

The email service includes robust error handling:

- **Service Initialization Failures:** Logged but don't crash the app
- **Email Sending Failures:** Logged but don't delay API response
- **Missing Credentials:** Service disables gracefully
- **Network Issues:** Errors are caught and logged

Emails are sent **non-blocking** - if email fails, it won't affect the API response.

## Testing the System

### Manual Testing

1. **Test Welcome Email:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "fullName": "Test User",
       "email": "test@example.com",
       "password": "TestPassword123!"
     }'
   ```
   Check the email inbox for welcome email.

2. **Test Login Email:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "TestPassword123!"
     }'
   ```
   Check the email inbox for login notification email.

### Console Logs

The system logs all email activities:
```
✓ Email service initialized successfully
✓ Welcome email sent to user@example.com (Message ID: xxx)
✓ Login notification email sent to user@example.com (Message ID: xxx)
✗ Failed to send email to user@example.com: Connection refused
```

## Production Considerations

### Gmail Limitations
- Rate limit: ~500 emails per day
- Best for small projects and testing
- Consider upgrading to a dedicated email service for larger scale

### Recommended Production Services
- **SendGrid** - Most reliable, great UI
- **MailGun** - Developer-friendly APIs
- **AWS SES** - Scalable, cost-effective
- **Postmark** - Transactional email specialist

To use these services, update `emailService.js` with appropriate transporter configuration.

### Security Best Practices
- ✅ Never commit `.env` file to version control
- ✅ Use strong, unique passwords/app passwords
- ✅ Store credentials in secure environment variable managers
- ✅ Rotate credentials regularly
- ✅ Monitor email sending logs
- ✅ Implement rate limiting on auth endpoints

## Monitoring and Logs

Monitor email delivery in the console:

```javascript
// Check service status anytime in code
const emailService = require('./services/emailService');
console.log(emailService.getStatus());
// Output:
// {
//   initialized: true,
//   serviceProvider: 'gmail',
//   sender: 'your-email@gmail.com'
// }
```

## Troubleshooting

### "Email service not initialized"
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Verify credentials are correct
- Check email service provider is 'gmail' or 'smtp'

### "Connection refused" Error
- Verify internet connection
- Check firewall settings
- For Gmail: Verify app password (not regular password)
- For SMTP: Check host, port, and credentials

### "Invalid credentials" Error
- For Gmail: Generate new app password
- For SMTP: Verify username and password with your provider
- Check for trailing spaces in env variables

### Emails Not Sending But No Error
- Check email service configuration
- Verify `EMAIL_SERVICE` value
- Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are set
- Check email provider rate limits

## API Response During Email Failures

Even if email sending fails, the API responds successfully:

```json
{
  "message": "Registration successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "Test User",
    "email": "test@example.com"
  }
}
```

The error is only logged in console, not affecting user experience.

## Rate Limiting (Future Enhancement)

For production, implement rate limiting on auth endpoints:
```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 requests per window
});

router.post('/register', authLimiter, /* ... */);
router.post('/login', authLimiter, /* ... */);
```

## Questions or Issues?

For help with the email system:
1. Check this README
2. Review console logs for error messages
3. Verify `.env` configuration
4. Check email provider documentation
5. Contact Seth Shoes Station support

---

**Last Updated:** May 2024
**Email System Version:** 1.0.0
