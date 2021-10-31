const Router = require('koa-router');
const join = new Router();
const userSchema = require('../models/user');
const bcrypt = require('bcrypt');

join.get('/join', async (ctx) => {
  await ctx.render('join');
});

join.post('/join/joinSuccess', async (ctx) => {
  //클라이언트 측에서의 데이터
  const data = ctx.request.body;
  const re = /^[a-z0-9]{4,12}$/;
  const rePw = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/;

  // 모듈을 사용하여 데이터 베이스 연결
  //데이터 베이스에서 클라이언트의 ID에 해당하는 유저 정보를 가져온다.
  const user = await userSchema.findOne({ id: data.id }).exec();

  // 유저가 없을경우
  const idBool = check(re, data.id);
  const pwBool = check(rePw, data.pw);
  if (idBool === true) {
    if (pwBool === true) {
      if (!user) {
        if (data.pw !== data.pw2) {
          //입력 패스워드와 확인패스워드가 맞지 않을경우
          ctx.res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
          });
          ctx.res.write(
            "<script>alert('패스워드가 다릅니다. 패스워드를 확인해주세요')</script>"
          );
          ctx.res.write('<script>window.location="/api/join"</script>');
        } else if (data.pw === data.pw2) {
          const password = data.pw;

          // bcrypt api를 이용한 패스워드의 암호화
          const encodedPassword = await bcrypt.hash(password, 10);

          // 암호화 한 패스워드와 클라이언트측의 정보를 모아 데이터베이스에 인설트
          const payload = new userSchema({
            id: data.id,
            name: data.name,
            pw: encodedPassword,
          });
          await payload.save();
          // 성공시 성공 메시지를 띄움
          ctx.res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
          });
          ctx.res.write("<script>alert('회원가입에 성공하셨습니다!')</script>");
          ctx.res.write('<script>window.location="/"</script>');
        } else {
          throw new Error('error');
        }
      } else {
        // 클라이언트가 보낸 ID와 데이터베이스의 ID가 같다면 중복 메세지를 띄우고 리다이렉트
        if (user.id === data.id) {
          ctx.res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
          });
          ctx.res.write(
            `<script>alert('해당 유저는 이미 존재합니다')</script>`
          );
          ctx.res.write('<script>window.location="/api/join"</script>');
        }
      }
    } else {
      ctx.res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      ctx.res.write(
        "<script>alert('형식에 맞지않는 패스워드 입니다.')</script>"
      );
      ctx.res.write('<script>window.location="/api/join"</script>');
    }
  } else {
    ctx.res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    ctx.res.write("<script>alert('형식에 맞지않는 아이디 입니다.')</script>");
    ctx.res.write('<script>window.location="/api/join"</script>');
  }
});

function check(re, item) {
  if (!re.test(item)) {
    return false;
  } else {
    return true;
  }
}

module.exports = join;
