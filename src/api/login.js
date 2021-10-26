const Router = require('koa-router');
const bcrypt = require('bcrypt');
const DBC = require('./DBC');
const login = new Router();

login.get('/login', async (ctx) => {
  await ctx.render('login');
});

login.post('/login/loginSuccess', async (ctx) => {
  const data = ctx.request.body;
  const password = data.pw;
  const client = await DBC();
  const user = await client.findOne({
    id: data.id,
  });
  if (!user) {
    ctx.body = `로그인 실패`;
  }
  const same = await bcrypt.compareSync(password, user.pw);
  ctx.body = `${user.name}님 안녕하세요!`;
});

module.exports = login;
