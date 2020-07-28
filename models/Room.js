const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    username: String,
    id: String,
  },
  slug: String,
  subscribers: [String],
  description: String,
  category: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', schema);