const decodeToken = require('../token/decodeToken');
const refreshToken = require('../token/refreshToken');
const DBC = require('../api/DBC');

let auth = async (ctx, next) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  if (!_accessToken) {
    ctx.body = '권한이 없습니다.';
  }
  const acToken = await decodeToken(_accessToken);
  const rfoken = await decodeToken(_refreshToken);
  if (!acToken) {
    if (!refreshToken) {
      throw new Error('접근권한이 없습니다.');
    } else {
      await refreshToken(rfoken);
    }
    console.log('auth');
    await ctx.render('login');
  } else {
    ctx.request.body = decoded;
    await next();
  }
};

module.exports = auth;
