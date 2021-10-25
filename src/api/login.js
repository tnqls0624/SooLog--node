const Router = require('koa-router');
const DBC = require('./DBC');
const login = new Router();

login.get('/login', async (ctx) => {
  await ctx.render('login');
});

login.post('/login/loginSuccess', async (ctx) => {
  const data = ctx.request.body;
  const client = await DBC();
  const user = await client.findOne({
    id: data.id,
    pw: data.pw,
  });
  if (!user) {
    ctx.body = `로그인 실패`;
  } else if (data.id === user.id && data.pw === user.pw) {
    ctx.body = `${user.name}님 안녕하세요!`;
  } else {
    throw new Error('why?');
  }
});

module.exports = login;
