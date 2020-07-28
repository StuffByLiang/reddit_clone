const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  bio: String,
  image: String,
  lowercase: String,
  fullName: String,
  description: String,
  phone: String,
  location: String,
  password: {
    type: String,
    default: ""
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', schema);