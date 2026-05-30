# Email System - Quick Reference Card

## 🚀 Quick Start (5 minutes)

### 1. Install
```bash
npm install
```

### 2. Configure .env
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=<app-password>
```

For Gmail: Get app password at https://myaccount.google.com/apppasswords

### 3. Test
```bash
node utils/testEmail.js
```

### 4. Run Server
```bash
npm start
```

**Done!** ✅ Emails will auto-send on register/login

---

## 📧 What Happens Automatically

### Registration
User registers → Welcome email sent → Account created

### Login
User logs in → Login notification email sent → Session created

Both include:
- ✅ Responsive HTML design
- ✅ Security information
- ✅ Company branding
- ✅ Support contact info

---

## 🔧 Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start server with email system |
| `npm install` | Install dependencies |
| `node utils/testEmail.js` | Test email setup |
| `node utils/testEmail.js welcome` | Test welcome email |
| `node utils/testEmail.js login` | Test login email |

---

## ⚙️ Configuration

### Gmail
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=<app-password>
```

### SMTP
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Service not initialized | Check .env credentials |
| Connection refused | Verify internet & credentials |
| Invalid credentials | Use Gmail app password, not regular password |
| Emails not received | Check spam folder, test with `node utils/testEmail.js` |

---

## 📁 Key Files

- **README-EMAIL.md** - Full documentation
- **services/emailService.js** - Email service
- **utils/emailTemplates.js** - Email designs
- **utils/testEmail.js** - Test utility
- **.env.example** - Configuration template

---

## ✅ Verification Checklist

- [ ] Nodemailer installed (`npm install`)
- [ ] .env configured with email credentials
- [ ] Email test passes (`node utils/testEmail.js`)
- [ ] Server starts without errors (`npm start`)
- [ ] Email service shows "✓ ACTIVE" on startup
- [ ] Test registration sends welcome email
- [ ] Test login sends notification email

---

## 🎯 Features

✅ Automatic welcome emails
✅ Automatic login notifications
✅ Device & IP tracking
✅ Responsive mobile designs
✅ Error handling & logging
✅ Non-blocking (fast responses)
✅ Security-focused templates

---

## 📞 Support

1. Check README-EMAIL.md
2. Run `node utils/testEmail.js`
3. Check server console logs
4. Verify .env configuration

---

**Email System Status:** Production Ready ✅
**Version:** 1.0.0
**Updated:** May 2024

