const Router = require('koa-router');
const join = new Router();
const mongo = require('../mongo');

const _client = mongo.connect();
async function DBC() {
  const client = await _client;
  return client.db('test').collection('devices');
}

join.get('/join', async (ctx) => {
  await ctx.render('join');
});

join.post('/join/joinSuccess', async (ctx) => {
  const data = ctx.request.body;
  console.log(data);
  const dbData = await DBC();
  await dbData.insertOne(data);
  ctx.body = 'loginSuccess!!!';
});

module.exports = join;
