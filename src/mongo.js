// .env를 이용하여 깃허브 업로드 방지 (몽고디비 URL 등)
require('dotenv').config();
// 몽고디비 연결문
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = client;
