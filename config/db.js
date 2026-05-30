const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const uriDefault = 'mongodb://127.0.0.1:27017/webtech_auth';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || uriDefault;
    console.log('Attempting to connect to MongoDB at', uri);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });

    console.log('✅ MongoDB connected successfully!');

    // Attach runtime event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB runtime error:', err);
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection state: connected');
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB connection state: disconnected');
    });

    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error && error.message ? error.message : error);
    return false;
  }
};

const isConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

module.exports = { connectDB, isConnected };
