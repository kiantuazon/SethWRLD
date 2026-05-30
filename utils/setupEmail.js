#!/usr/bin/env node

/**
 * Quick Setup Script for Email Notifications
 * Run this to get started with email notifications
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(message, 'bright');
  log(`${'='.repeat(60)}\n`, 'cyan');
}

function section(message) {
  log(`\n${message}`, 'bright');
  log('-'.repeat(message.length), 'cyan');
}

async function run() {
  header('Email Notification System - Setup Guide');

  section('Step 1: Check Dependencies');
  
  log('Checking for required packages...', 'yellow');
  
  try {
    require('nodemailer');
    log('✓ nodemailer is installed', 'green');
  } catch (e) {
    log('✗ nodemailer not found', 'red');
    log('Run: npm install', 'yellow');
    process.exit(1);
  }

  section('Step 2: Environment Configuration');
  
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  if (fs.existsSync(envPath)) {
    log('✓ .env file exists', 'green');
  } else {
    log('⚠ .env file not found', 'yellow');
    log('Creating .env from .env.example...', 'yellow');
    
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log('✓ .env file created', 'green');
      log('Edit .env with your email credentials', 'yellow');
    }
  }

  section('Step 3: Email Provider Setup');
  
  log('Choose your email provider:\n', 'bright');
  log('Option A: Gmail (Recommended)', 'green');
  log('  1. Enable 2-Factor Authentication on Gmail', 'yellow');
  log('  2. Visit: https://myaccount.google.com/apppasswords', 'yellow');
  log('  3. Generate "Mail" app password', 'yellow');
  log('  4. Add to .env:\n', 'yellow');
  log('     EMAIL_SERVICE=gmail', 'cyan');
  log('     EMAIL_USER=your-email@gmail.com', 'cyan');
  log('     EMAIL_PASSWORD=<app-password>', 'cyan');
  
  log('\n\nOption B: Custom SMTP', 'green');
  log('  Get credentials from your email provider and add to .env:\n', 'yellow');
  log('     EMAIL_SERVICE=smtp', 'cyan');
  log('     SMTP_HOST=smtp.example.com', 'cyan');
  log('     SMTP_PORT=587', 'cyan');
  log('     SMTP_SECURE=false', 'cyan');
  log('     EMAIL_USER=your-email@domain.com', 'cyan');
  log('     EMAIL_PASSWORD=your-password', 'cyan');

  section('Step 4: Test Configuration');
  
  log('Run the email test utility:\n', 'yellow');
  log('  npm run test:email', 'cyan');
  log('\nOr directly:\n', 'yellow');
  log('  node utils/testEmail.js', 'cyan');
  log('  node utils/testEmail.js welcome  # Test welcome email only', 'cyan');
  log('  node utils/testEmail.js login    # Test login email only', 'cyan');

  section('Step 5: Verify Integration');
  
  log('Files modified for email support:', 'yellow');
  log('  ✓ routes/auth.js - Sends emails on register/login', 'green');
  log('  ✓ services/emailService.js - Main email service', 'green');
  log('  ✓ utils/emailTemplates.js - Email templates', 'green');
  log('  ✓ package.json - Added nodemailer dependency', 'green');
  log('  ✓ .env.example - Email configuration template', 'green');

  section('Quick Test');
  
  log('After configuration, test the system:', 'yellow');
  log('\n1. Start the server:', 'yellow');
  log('   npm start', 'cyan');
  
  log('\n2. Register a new user:', 'yellow');
  log('   curl -X POST http://localhost:5000/api/auth/register \\', 'cyan');
  log('     -H "Content-Type: application/json" \\', 'cyan');
  log('     -d \'{"fullName":"Test User","email":"you@example.com","password":"Pass123!"}\'', 'cyan');
  
  log('\n3. Check your email for welcome message', 'yellow');

  section('Documentation');
  
  log('For detailed information, see:', 'yellow');
  log('  • README-EMAIL.md - Complete setup and troubleshooting', 'green');
  log('  • utils/testEmail.js - Test utility script', 'green');
  log('  • services/emailService.js - Source code with comments', 'green');

  section('Troubleshooting');
  
  log('Common issues:\n', 'yellow');
  log('❌ "Email service not initialized"', 'red');
  log('   → Check EMAIL_USER and EMAIL_PASSWORD in .env\n', 'yellow');
  
  log('❌ "Connection refused"', 'red');
  log('   → Verify internet connection and credentials\n', 'yellow');
  
  log('❌ "Invalid credentials"', 'red');
  log('   → For Gmail, use App Password, not regular password\n', 'yellow');
  
  log('❌ Emails not received', 'red');
  log('   → Check spam folder\n', 'yellow');
  log('   → Verify .env configuration\n', 'yellow');
  log('   → Run test: node utils/testEmail.js\n', 'yellow');

  header('Setup Complete!');
  
  log('You\'re ready to go! The email system will automatically:', 'green');
  log('  • Send welcome emails on registration', 'cyan');
  log('  • Send login notifications on login', 'cyan');
  log('  • Handle errors gracefully without affecting API', 'cyan');
  
  log('\nFor support, check README-EMAIL.md or test with:', 'yellow');
  log('  node utils/testEmail.js', 'cyan');
  log('');
}

run().catch(error => {
  log(`\nError: ${error.message}`, 'red');
  process.exit(1);
});
