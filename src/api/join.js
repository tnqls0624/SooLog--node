var msg = require('alert');
const Router = require('koa-router');
const join = new Router();
const DBC = require('./DBC');
const bcrypt = require('bcrypt');

join.get('/join', async (ctx) => {
  await ctx.render('join');
});

join.post('/join/joinSuccess', async (ctx) => {
  const data = ctx.request.body;
  const client = await DBC();
  console.log(data);
  const user = await client.findOne({ id: data.id, pw: data.pw });
  console.log(user);
  if (!user) {
    if (data.pw !== data.pw2) {
      msg(`패스워드가 다릅니다. 패스워드를 확인해주세요`);
      ctx.redirect('/api/join');
    }
    const password = data.pw;
    const encodedPassword = await bcrypt.hash(password, 10);
    const result = {
      id: data.id,
      name: data.name,
      pw: encodedPassword,
    };
    console.log(result);
    await client.insertOne(result);
    ctx.body = 'JoinSuccess';
  } else {
    if (user.id === data.id) {
      msg(`${user.id} 는 이미 존재하는 아이디입니다.`);
      ctx.redirect('/api/join');
    }
  }
});

module.exports = join;
