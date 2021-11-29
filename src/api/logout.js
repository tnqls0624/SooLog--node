const Router = require('koa-router');

const logout = new Router();

logout.get('/logout', async (ctx) => {
  ctx.cookies.set('access_token', null, {
    maxAge: 0,
    httpOnly: true,
  });
  ctx.cookies.set('refresh_token', null, {
    maxAge: 0,
    httpOnly: true,
  });
  await ctx.redirect('/');
});

module.exports = logout;
