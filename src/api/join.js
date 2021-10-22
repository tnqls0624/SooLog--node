var msg = require('alert');
const Router = require('koa-router');
const join = new Router();
const DBC = require('./DBC');

join.get('/join', async (ctx) => {
  await ctx.render('join');
});

join.post('/join/joinSuccess', async (ctx) => {
  const data = ctx.request.body;
  const client = await DBC();
  const user = await client.findOne({ devices: ctx.login });

  if (user.login === data.login) {
    msg(`${user.login} 는 이미 존재하는 아이디입니다.`);
    // (`${user.login} 는 이미 존재하는 아이디입니다.`);
    ctx.redirect('/api/join');
  }
  if (data.pw !== data.pw2) {
    msg(`패스워드가 다릅니다. 패스워드를 확인해주세요`);
    ctx.redirect('/api/join');
  }
  await client.insertOne(data);
});

module.exports = join;
