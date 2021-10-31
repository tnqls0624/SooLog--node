const mongoose = require('mongoose');
require('dotenv').config();

function DBC() {
  mongoose.connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err) {
      if (err) {
        console.error('mongodb connection error', err);
      } else {
        console.log('mongodb connected');
      }
    }
  );
}
DBC();
mongoose.connection.on('disconnected', DBC);
require('./models/post');
require('./models/user');

module.exports = DBC;
