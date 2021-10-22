const mongo = require('../mongo');

const _client = mongo.connect();

const DBC = async function connection() {
  const client = await _client;
  return client.db('test').collection('devices');
};

module.exports = DBC;
