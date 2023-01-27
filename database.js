const mongoose = require('mongoose');
require('dotenv').config();

const mongoDB_URI = process.env['MONGO_URI'];

// connect to database
mongoose.connect(mongoDB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection error'));

// create user Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  exLog: [{
    description: String,
    duration: Number,
    date: String
  }]
});

module.exports = mongoose.model('User', userSchema);

