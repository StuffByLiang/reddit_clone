const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  checked: Boolean,
  type: String,
  user: {
    username: String,
    id: String
  },
  task: String,
  title: String,
  description: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', schema);