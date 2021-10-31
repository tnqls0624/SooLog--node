const Router = require('koa-router');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user');
const generateToken = require('../token/generateToken');
const refreshToken = require('../token/refreshToken');
require('dotenv').config();
const login = new Router();

login.get('/login', async (ctx) => {
  await ctx.render('login');
});

login.post('/login/loginSuccess', async (ctx) => {
  //클라이언트 측에서의 데이터
  const data = ctx.request.body;
  const password = data.pw;

  // 모듈을 사용하여 데이터 베이스 연결
  //데이터 베이스에서 클라이언트의 ID에 해당하는 유저 정보를 가져온다.
  const user = await userSchema.findOne({ id: data.id }).exec();

  // 유저가 없을경우 로그인 실패
  if (!user) {
    ctx.res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    ctx.res.write(
      "<script>alert('해당하는 유저가 존재하지 않습니다.')</script>"
    );
    ctx.res.write('<script>window.location="/"</script>');
  } else {
    // 암호를 복호화하여 클라이언트로부터의 암호와 DB에서의 암호를 비교 후 판별
    const same = await bcrypt.compareSync(password, user.pw);
    if (same) {
      const payload = {
        id: user.id,
        pw: user.pw,
        name: user.name,
      };
      //access_token 발급
      const actoken = await generateToken(payload);
      //refresh_token 발급
      const rfToken = await refreshToken(payload);
      //DB에 데이터 추가
      userSchema
        .findOneAndUpdate(user.id, {
          $set: {
            rftoken: rfToken,
          },
        })
        .exec();
      //브라우저에 쿠키 세팅
      ctx.cookies.set('refresh_token', rfToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      ctx.cookies.set('access_token', actoken, {
        httpOnly: true,
        maxAge: 1000 * 60,
      });
      await ctx.render('home', {
        actoken: actoken,
        name: user.name,
      });
    } else {
      ctx.res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      ctx.res.write("<script>alert('비밀번호가 맞지 않습니다.')</script>");
      ctx.res.write('<script>window.location="/"</script>');
    }
  }
});

module.exports = login;
