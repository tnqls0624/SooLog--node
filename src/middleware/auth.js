const decodeToken = require('../token/decodeToken');
const refreshToken = require('../token/refreshToken');
const generateToken = require('../token/generateToken');
const DBC = require('../api/DBC');

let auth = async (ctx, next) => {
  const client = await DBC();
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await client.findOne({
    token: _refreshToken,
  });
  //액세스 토큰이 없는경우
  if (_accessToken === null) {
    ctx.body = '접근권한이 없습니다.';
  }
  const acToken = await decodeToken(_accessToken);
  const rfToken = await decodeToken(_refreshToken);
  if (acToken === undefined) {
    if (rfToken === undefined) {
      // 액세스 토큰도 없고 리프레시 토큰도 없는경우
      throw new Error('접근권한이 없습니다.');
    } else {
      //액세스 토큰은 없고 리프레시 토큰은 있는 경우
      const newToken = await generateToken({
        id: user.id,
        name: user.name,
        pw: user.pw,
      });
      ctx.cookies.set('access_token', newToken, {
        httpOnly: true,
        maxAge: 1000 * 60,
      });
      console.log('auth');
      await next();
    }
  } else {
    if (rfToken === undefined) {
      //액세스 토큰은 있고 리프레시 토큰이 없는경우
      const newrefreshToken = await refreshToken();
      await client.updateOne(
        { id: user.id },
        {
          $set: {
            token: newrefreshToken,
          },
        }
      );
    } else {
      // 전부 다 있는경우
      await next();
    }
  }
};

module.exports = auth;
