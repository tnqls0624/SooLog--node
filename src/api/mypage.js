const auth = require('../middleware/auth');
const Router = require('koa-router');
const myPage = new Router();

myPage.get('/myPage', auth, async (ctx) => {
  await ctx.render('myPage');
});

module.exports = myPage;
