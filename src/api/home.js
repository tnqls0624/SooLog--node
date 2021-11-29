const Router = require('koa-router');
const home = new Router();
const PostSchema = require('../models/post');
const userSchema = require('../models/user');
home.get('/', async (ctx) => {
  //views가 많은 숫서의 게시물 5개를 뽑는다
  const popularityPost = await PostSchema.find().sort({ views: -1 }).limit(5);
  const newPost = await PostSchema.find().sort({ createdAt: -1 }).limit(5);
  const { postTitle, postId } = distinguishPost(popularityPost);
  const _newPost = distinguishPost(newPost);
  let { _accessToken, _refreshToken } = await loadToken(ctx);
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  await ctx.render('home', {
    postTitle: postTitle,
    postId: postId,
    newPostTitle: _newPost.postTitle,
    newPostId: _newPost.postId,
    actoken: _accessToken,
    name: user.name,
  });
});
function distinguishPost(post) {
  let postTitle = [];
  let postId = [];
  for (let i = 0; i <= post.length - 1; i++) {
    postTitle.push(post[i].title);
    postId.push(post[i]._id);
  }
  return { postTitle, postId };
}

async function loadToken(ctx) {
  const _accessToken = ctx.cookies.get('access_token');
  const _refreshToken = ctx.cookies.get('refresh_token');
  const token = {
    _accessToken,
    _refreshToken,
  };
  return token;
}
module.exports = home;
