var msg = require('alert');
const Router = require('koa-router');
const join = new Router();
const DBC = require('./DBC');
const bcrypt = require('bcrypt');
const refreshToken = require('../token/refreshToken');

join.post('/join', async (ctx) => {
  await ctx.render('join');
});

join.post('/join/joinSuccess', async (ctx) => {
  //클라이언트 측에서의 데이터
  const data = ctx.request.body;

  // 모듈을 사용하여 데이터 베이스 연결
  const client = await DBC();

  //데이터 베이스에서 클라이언트의 ID에 해당하는 유저 정보를 가져온다.
  const user = await client.findOne({ id: data.id, pw: data.pw });

  // 유저가 없을경우 로그인 실패 및 리다이렉트
  if (!user) {
    if (data.pw !== data.pw2) {
      msg(`패스워드가 다릅니다. 패스워드를 확인해주세요`);
      ctx.redirect('/api/join');
    }
    const password = data.pw;

    // bcrypt api를 이용한 패스워드의 암호화
    const encodedPassword = await bcrypt.hash(password, 10);

    // 암호화 한 패스워드와 클라이언트측의 정보를 모아 데이터베이스에 인설트
    await client.insertOne(result);

    // 성공시 성공 메시지를 띄움
    ctx.body = 'JoinSuccess';
  } else {
    // 클라이언트가 보낸 ID와 데이터베이스의 ID가 같다면 중복 메세지를 띄우고 리다이렉트
    if (user.id === data.id) {
      msg(`${user.id} 는 이미 존재하는 아이디입니다.`);
      ctx.redirect('/api/join');
    }
  }
});

module.exports = join;
