const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  id: {
    type: String,
  },
  nickname: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;
