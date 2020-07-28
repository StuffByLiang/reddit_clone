const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    username: String,
    id: String,
  },
  numReplies: Number,
  slug: String,
  room: {
    name: String,
    slug: String,
  },
  description: String,
  title: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Topic', schema);