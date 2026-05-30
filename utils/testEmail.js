/**
 * Email Service Testing Utility
 * Run this script to verify email configuration is working correctly
 * 
 * Usage:
 *   node utils/testEmail.js [testType]
 * 
 * Test Types:
 *   welcome  - Test welcome email
 *   login    - Test login notification email
 *   both     - Test both (default)
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const emailService = require('../services/emailService');

const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_NAME = 'Test User';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEmailService() {
  const testType = process.argv[2] || 'both';

  log('\n' + '='.repeat(60), 'cyan');
  log('Email Service Test Suite', 'bright');
  log('='.repeat(60) + '\n', 'cyan');

  // Check configuration
  log('Configuration Status:', 'bright');
  const status = emailService.getStatus();
  log(`  Service Provider: ${status.serviceProvider}`, 'yellow');
  log(`  Sender: ${status.sender}`, 'yellow');
  log(`  Status: ${status.initialized ? 'Initialized ✓' : 'NOT Initialized ✗'}`, 
    status.initialized ? 'green' : 'red');

  if (!status.initialized) {
    log('\n⚠️  Email service not initialized!', 'red');
    log('Please check your .env file:\n', 'red');
    log('  EMAIL_SERVICE=gmail', 'yellow');
    log('  EMAIL_USER=your-email@gmail.com', 'yellow');
    log('  EMAIL_PASSWORD=your-app-password', 'yellow');
    process.exit(1);
  }

  log('\nRunning tests...\n', 'bright');

  // Test 1: Welcome Email
  if (testType === 'welcome' || testType === 'both') {
    log('TEST 1: Welcome Email', 'blue');
    log(`Sending welcome email to: ${TEST_EMAIL}`, 'yellow');
    
    try {
      const result = await emailService.sendWelcomeEmail(TEST_EMAIL, TEST_NAME);
      
      if (result.success) {
        log(`✓ Welcome email sent successfully!`, 'green');
        log(`  Message ID: ${result.messageId}`, 'green');
      } else {
        log(`✗ Failed to send welcome email`, 'red');
        log(`  Error: ${result.error}`, 'red');
      }
    } catch (error) {
      log(`✗ Exception occurred: ${error.message}`, 'red');
    }
    log('');
  }

  // Test 2: Login Notification Email
  if (testType === 'login' || testType === 'both') {
    log('TEST 2: Login Notification Email', 'blue');
    log(`Sending login notification to: ${TEST_EMAIL}`, 'yellow');
    
    try {
      const loginInfo = {
        timestamp: new Date().toLocaleString(),
        deviceInfo: 'Chrome Browser (Test)',
        ipAddress: '192.168.1.100'
      };

      const result = await emailService.sendLoginNotificationEmail(
        TEST_EMAIL,
        TEST_NAME,
        loginInfo
      );

      if (result.success) {
        log(`✓ Login notification email sent successfully!`, 'green');
        log(`  Message ID: ${result.messageId}`, 'green');
      } else {
        log(`✗ Failed to send login notification email`, 'red');
        log(`  Error: ${result.error}`, 'red');
      }
    } catch (error) {
      log(`✗ Exception occurred: ${error.message}`, 'red');
    }
    log('');
  }

  // Test 3: Verify Transporter (optional)
  log('TEST 3: Transporter Verification', 'blue');
  try {
    const verified = await emailService.verifyTransporter();
    if (verified) {
      log('✓ Email transporter verified and ready!', 'green');
    } else {
      log('✗ Transporter verification failed', 'red');
    }
  } catch (error) {
    log(`✗ Exception during verification: ${error.message}`, 'red');
  }
  log('');

  log('='.repeat(60), 'cyan');
  log('Test Suite Completed', 'bright');
  log('='.repeat(60) + '\n', 'cyan');

  log('NEXT STEPS:', 'bright');
  log('1. Check your email inbox (and spam folder) for test emails');
  log('2. If emails were sent successfully, the system is ready to use');
  log('3. If emails failed, review the error messages above');
  log('4. For Gmail: Verify you used an App Password, not your regular password\n', 'yellow');
}

// Run tests
testEmailService().catch(error => {
  log(`Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
