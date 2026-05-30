// IMPORTANT: Set DNS BEFORE importing mongoose
const dns = require('dns');
const path = require('path');

// Force Google DNS for all DNS queries
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables as early as possible
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const { connectDB } = require('./config/db');
const { startMongo } = require('./scripts/start-mongo');
const authRoutes = require('./routes/auth');
const emailService = require('./services/emailService');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // If a full MONGO_URI wasn't provided, allow constructing it from components
  // Useful when deploying to hosts that expose separate vars (user/pass/host/db)
  if (!process.env.MONGO_URI && process.env.MONGO_USER && process.env.MONGO_HOST && process.env.MONGO_DB) {
    const user = encodeURIComponent(process.env.MONGO_USER);
    const pass = process.env.MONGO_PASS ? encodeURIComponent(process.env.MONGO_PASS) : '';
    const host = process.env.MONGO_HOST; // can be host:port or atlas host
    const db = process.env.MONGO_DB;
    const srv = process.env.MONGO_SRV === 'true' || process.env.MONGO_HOST?.includes('mongodb+srv');

    const credentials = pass ? `${user}:${pass}@` : `${user}@`;
    const protocol = srv ? 'mongodb+srv' : 'mongodb';

    process.env.MONGO_URI = `${protocol}://${credentials}${host}/${db}?retryWrites=true&w=majority`;
    console.log('Constructed MONGO_URI from components. Using:', process.env.MONGO_URI.replace(/:.+@/, ':*****@'));
  }
  if (process.env.AUTO_START_MONGO === 'true') {
    const mongoStarted = await startMongo();
    if (!mongoStarted) {
      console.error('Failed to start MongoDB automatically.');
      process.exit(1);
    }
  }

  const connected = await connectDB();
  if (!connected) {
    console.error('Failed to connect to MongoDB. Server will not start.');
    process.exit(1);
  }

  // Mount routes only after DB connection succeeds so they can't be used while disconnected
  app.use('/api/auth', authRoutes);

  const server = app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Server started on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Display email service status
    const emailStatus = emailService.getStatus();
    console.log(`\nEmail Service: ${emailStatus.initialized ? '✓ ACTIVE' : '✗ INACTIVE'}`);
    if (emailStatus.initialized) {
      console.log(`  Provider: ${emailStatus.serviceProvider}`);
      console.log(`  From: ${emailStatus.sender}`);
    } else {
      console.log(`  Status: Not configured - emails will not be sent`);
      console.log(`  Setup: See README-EMAIL.md for configuration`);
    }
    
    console.log(`${'='.repeat(60)}\n`);
  });

  // If mongoose disconnects, close the HTTP server to avoid serving requests without DB
  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB disconnected. Shutting down server.');
    server.close(() => process.exit(1));
  });
};

startServer();
