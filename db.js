const mongoose = require('mongoose');

// Database URI
const db = 'mongodb://localhost:27017/fightFlixDB';

// Connecting database to mongoose asynchronously
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
