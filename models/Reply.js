const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  type: String,
  user: {
    username: String,
    id: String,
  },
  to: {
    replyId: String,
    topicId: String,
    id: String,
    slug: String,
    userId: String,
    username: String
  },
  topicSlug: String,
  comment: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reply', schema);