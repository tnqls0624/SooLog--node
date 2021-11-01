const { ObjectId } = require('bson');
const Router = require('koa-router');
const posts = new Router();
const PostSchema = require('../models/post');
const userSchema = require('../models/user');
const auth = require('../middleware/auth');

// 첫화면 만든 시간을 순서로 게시글을 가져옴
posts.get('/posts', async (ctx) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await userSchema.findOne({ rftoken: _refreshToken }).exec();
  const _posts = await PostSchema.find({}).sort('-createAt').exec();
  if (user) {
    await ctx.render('posts/index', {
      posts: _posts,
      actoken: _accessToken,
      name: user.name,
    });
  } else {
    await ctx.render('posts/index', {
      posts: _posts,
      actoken: _accessToken,
    });
  }
});

// 작성페이지 이동
posts.get('/posts/new', auth, async (ctx) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await userSchema.findOne({ rftoken: _refreshToken }).exec();
  const _posts = await PostSchema.find({}).sort('-createAt').exec();
  await ctx.render('posts/new', {
    posts: _posts,
    actoken: _accessToken,
    name: user.name,
  });
});

// 작성
posts.post('/posts', auth, async (ctx) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await userSchema.findOne({ rftoken: _refreshToken }).exec();
  const _posts = await PostSchema.find({}).sort('-createAt').exec();
  const data = ctx.request.body;
  PostSchema.create(data);
  await ctx.redirect('/api/posts', {
    posts: _posts,
    actoken: _accessToken,
    name: user.name,
  });
});

//작성글 확인
posts.get('/posts/:id', auth, async (ctx) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await userSchema.findOne({ rftoken: _refreshToken }).exec();
  const data = ctx.params;
  const post = await PostSchema.findOne({ _id: ObjectId(data.id) }).exec();
  await ctx.render('posts/show', {
    post: post,
    actoken: _accessToken,
    name: user.name,
  });
});

// 편집
posts.get('/posts/:id/edit', auth, async (ctx) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await userSchema.findOne({ rftoken: _refreshToken }).exec();
  const data = ctx.params;
  const post = await PostSchema.findOne({ _id: data.id });
  ctx.render('posts/edit', {
    post: post,
    actoken: _accessToken,
    name: user.name,
  });
});

//업데이트
posts.put('/posts/:id', auth, async (ctx) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await userSchema.findOne({ rftoken: _refreshToken }).exec();
  const data = ctx.params;
  ctx.request.body.updataAt = Date.now();
  PostSchema.findOneAndUpdate({ id: data.id }, ctx.request.body);
  await ctx.redirect('/posts/' + data.id, {
    actoken: _accessToken,
    name: user.name,
  });
});

//삭제
posts.delete('/posts/:id', auth, async (ctx) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await userSchema.findOne({ rftoken: _refreshToken }).exec();
  const data = ctx.params;
  PostSchema.deleteOne({ id: data.id });
  await ctx.redirect('/posts', {
    actoken: _accessToken,
    name: user.name,
  });
});
module.exports = posts;
