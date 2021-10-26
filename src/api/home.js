const Router = require('koa-router');
const home = new Router();

home.get('/', async (ctx) => {
  await ctx.render('home_login');
});

module.exports = home;
