const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

const counter = mongoose.model('counter', counterSchema);

module.exports = counter;
