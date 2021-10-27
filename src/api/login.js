const Router = require('koa-router');
const bcrypt = require('bcrypt');
const DBC = require('./DBC');
const generateToken = require('../token/generateToken');
const refreshToken = require('../token/refreshToken');
const { Db } = require('mongodb');
require('dotenv').config();
const login = new Router();

login.get('/login', async (ctx) => {
  await ctx.render('home_login');
});

login.post('/login/loginSuccess', async (ctx) => {
  //클라이언트 측에서의 데이터
  const data = ctx.request.body;
  const password = data.pw;

  // 모듈을 사용하여 데이터 베이스 연결
  const client = await DBC();

  //데이터 베이스에서 클라이언트의 ID에 해당하는 유저 정보를 가져온다.
  const user = await client.findOne({
    id: data.id,
  });

  // 유저가 없을경우 로그인 실패
  if (!user) {
    ctx.body = `로그인 실패`;
  }

  // 암호를 복호화하여 클라이언트로부터의 암호와 DB에서의 암호를 비교 후 판별
  const same = await bcrypt.compareSync(password, user.pw);
  if (same) {
    const payload = {
      id: user.id,
      pw: user.pw,
      name: user.name,
    };
    //access_token 발급
    const token = await generateToken(payload);
    console.log(token);
    //refresh_token 발급
    const rfToken = await refreshToken(payload);
    //DB에 데이터 추가
    await client.updateOne(
      { id: user.id },
      {
        $set: {
          token: rfToken,
        },
      }
    );
    //브라우저에 쿠키 세팅
    ctx.cookies.set('refresh_token', rfToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    ctx.cookies.set('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    await ctx.render('loginPage');
  } else {
    ctx.body = '비밀번호가 틀립니다.';
  }
});

module.exports = login;
