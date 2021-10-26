require('dotenv').config();
const Router = require('koa-router');
const jwt = require('jsonwebtoken');

const myPage = new Router();
const jwtSecret = process.env.SECRET_KEY;
myPage.get('/myPage', async (ctx) => {
  let token = ctx.cookies.get('access_token');

  let decoded = jwt.verify(token, jwtSecret);
  if (decoded) {
    await ctx.render('myPage');
  } else {
    ctx.body = '권한이 없습니다.';
  }
});

module.exports = myPage;
