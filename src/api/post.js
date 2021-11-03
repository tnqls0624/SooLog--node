const { ObjectId } = require('bson');
const Router = require('koa-router');
const posts = new Router();
const PostSchema = require('../models/post');
const userSchema = require('../models/user');
const auth = require('../middleware/auth');

async function findUser(_refreshToken) {
  return await userSchema.findOne({ rftoken: _refreshToken }).exec();
}

// 첫화면 만든 시간을 순서로 게시글을 가져옴
posts.get('/posts', async (ctx) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  const _posts = await PostSchema.find({}).sort('-createdAt').exec();
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
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  const _posts = await PostSchema.find({}).sort('-createAt').exec();
  await ctx.render('posts/new', {
    posts: _posts,
    acToken: _accessToken,
    name: user.name,
    id: user.id,
  });
});

// 작성
posts.post('/posts', auth, async (ctx) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await findUser(_refreshToken);
  const _posts = await PostSchema.find({}).sort('-createAt').exec();
  const data = ctx.request.body;
  PostSchema.create(data);
  if (user) {
    await ctx.redirect('/api/posts', {
      posts: _posts,
      acToken: _accessToken,
      name: user.name,
    });
  } else {
    await ctx.redirect('/api/posts', {
      posts: _posts,
      acToken: _accessToken,
    });
  }
});

//작성글 확인
posts.get('/posts/:id', auth, async (ctx) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await findUser(_refreshToken);
  const data = ctx.params;
  const post = await PostSchema.findOne({ _id: ObjectId(data.id) }).exec();
  if (user) {
    await ctx.render('posts/show', {
      post: post,
      acToken: _accessToken,
      name: user.name,
      postId: post.id,
    });
  } else {
    await ctx.render('posts/show', {
      post: post,
      acToken: _accessToken,
    });
  }
});

// 편집
posts.get('/posts/:id/edit', auth, async (ctx) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await findUser(_refreshToken);
  const data = ctx.params;
  const post = await PostSchema.findOne({ _id: ObjectId(data.id) }).exec();
  if (user) {
    await ctx.render('posts/edit', {
      post: post,
      acToken: _accessToken,
      name: user.name,
      postId: post.id,
    });
  } else {
    await ctx.render('posts/edit', {
      post: post,
      acToken: _accessToken,
    });
  }
});

//업데이트
posts.post('/posts/:id', auth, async (ctx) => {
  const data = ctx.request.body;
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await findUser(_refreshToken);
  const param = ctx.params;
  const updatedAt = Date.now();
  await PostSchema.findOneAndUpdate(
    { _id: ObjectId(param.id) },
    {
      $set: {
        title: data.title,
        body: data.body,
        updatedAt: updatedAt,
      },
    },
    { upsert: true }
  );
  const post = await PostSchema.findOne({ _id: ObjectId(param.id) }).exec();
  if (user) {
    await ctx.redirect('/api/posts/' + param.id, {
      actoken: _accessToken,
      name: user.name,
      postId: post.id,
    });
  } else {
    await ctx.redirect('/api/posts/' + param.id, {
      actoken: _accessToken,
    });
  }
});

//삭제
posts.delete('/posts/:id', auth, async (ctx) => {
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await findUser(_refreshToken);
  const data = ctx.params;
  PostSchema.deleteOne({ id: data.id });
  if (user) {
    await ctx.redirect('/posts', {
      actoken: _accessToken,
      name: user.name,
    });
  } else {
    await ctx.redirect('/posts', {
      actoken: _accessToken,
    });
  }
});
module.exports = posts;
