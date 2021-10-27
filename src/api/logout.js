const Router = require('koa-router');

const logout = new Router();

logout.get('/logout', async (ctx) => {
  ctx.cookies.set('access_token', null, {
    maxAge: 0,
    httpOnly: true,
  });
  await ctx.render('home');
});

module.exports = logout;
