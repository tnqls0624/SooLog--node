const Router = require('koa-router');
const login = new Router();

login.get('/login', async (ctx) => {
  await ctx.render('login');
});

module.exports = login;
