const decodeToken = require('../token/decodeToken');

let auth = async (ctx, next) => {
  let token = ctx.cookies.get('access_token');
  if (!token) {
    ctx.body = '토큰의 유효기간이 지났습니다.';
  }
  const decoded = await decodeToken(token);
  if (!decoded) {
    console.log('auth');
    ctx.body = '권한이 없습니다.';
  } else {
    ctx.request.body = decoded;
    await next();
  }
};

module.exports = auth;
