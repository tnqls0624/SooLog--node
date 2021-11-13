const decodeToken = require('../token/decodeToken');
const refreshToken = require('../token/refreshToken');
const generateToken = require('../token/generateToken');
const userSchema = require('../models/user');

let auth = async (ctx, next) => {
  //해당 토큰을 받아온다
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');

  const user = await userSchema.findOne({ rftoken: _refreshToken }).exec();
  //액세스 토큰이 없는경우
  if (_accessToken === null) {
    await ctx.render('notAccess');
  }
  const acToken = await decodeToken(_accessToken);
  const rfToken = await decodeToken(_refreshToken);
  if (acToken === undefined) {
    if (rfToken === undefined) {
      // 액세스 토큰도 없고 리프레시 토큰도 없는경우
      await ctx.render('notAccess');
    } else {
      //액세스 토큰은 없고 리프레시 토큰은 있는 경우
      const newToken = await generateToken({
        id: user.id,
        name: user.name,
        pw: user.pw,
      });
      ctx.cookies.set('access_token', newToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2,
      });
      console.log('액세스토큰 갱신');
      await next();
    }
  } else {
    if (rfToken === undefined) {
      //액세스 토큰은 있고 리프레시 토큰이 없는경우
      //새로운 refreshToken을 생성하고 쿠키에 새로 세팅 후 DB에 투입
      const newRefreshToken = await refreshToken();
      ctx.cookies.set('refresh_token', newRefreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      await client.updateOne(
        { id: user.id },
        {
          $set: {
            token: newRefreshToken,
          },
        }
      );
      console.log('리프레시토큰 갱신');
      await next();
    } else {
      // 전부 다 있는경우
      await next();
    }
  }
};

module.exports = auth;
