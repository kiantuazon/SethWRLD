const mongoose = require('mongoose');
const dns = require('dns');

// Set Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function checkDatabase() {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to MongoDB...\n');
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB!\n');
    
    const users = await User.find();
    console.log(`Found ${users.length} user(s) in database:\n`);
    
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  Name: ${user.fullName}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Created: ${user.createdAt}`);
      console.log('');
    });
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDatabase();
