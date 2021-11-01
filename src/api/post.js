const Router = require('koa-router');
const posts = new Router();
const PostSchema = require('../models/post');

// 첫화면 만든 시간을 순서로 게시글을 가져옴
posts.get('/posts', async (ctx) => {
  const _posts = await PostSchema.find({}).sort('-createAt').exec();
  await ctx.render('posts/index', { posts: _posts });
});

// 작성페이지 이동
posts.get('/posts/new', async (ctx) => {
  await ctx.render('posts/new');
});

// 작성
posts.post('/posts', async (ctx) => {
  const data = ctx.request.body;
  PostSchema.create(data, (err) => {
    if (err) {
      return (ctx.body = err);
    }
  });
  await ctx.redirect('/api/posts');
});

//작성글 확인
posts.get('/posts/:id', async (ctx) => {
  const data = ctx.params;
  console.log(data);
  const post = await PostSchema.findOne({ id: data.id }).exec();
  console.log(post);
  await ctx.render('posts/show', { post: post });
});

// 편집
posts.get('/posts/:id/edit', async (ctx) => {
  const data = ctx.params;
  PostSchema.findOne({ id: data.id }, (err, post) => {
    if (err) {
      return (ctx.body = err);
    }
    ctx.render('posts/edit', { post: post });
  });
});

//업데이트
posts.put('/posts/:id', async (ctx) => {
  const data = ctx.params;
  ctx.request.body.updataAt = Date.now();
  PostSchema.findOneAndUpdate(
    { id: data.id },
    ctx.request.body,
    (err, post) => {
      if (err) {
        return (ctx.body = err);
      }
      ctx.redirect('/posts/' + data.id);
    }
  );
});

//삭제
posts.delete('/posts/:id', (ctx) => {
  const data = ctx.params;
  PostSchema.deleteOne({ id: data.id }, (err) => {
    if (err) {
      return (ctx.body = err);
    }
    ctx.redirect('/posts');
  });
});
module.exports = posts;
