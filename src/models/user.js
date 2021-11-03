const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  pw: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rfToken: {
    type: String,
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
