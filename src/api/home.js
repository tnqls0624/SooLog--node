const Router = require('koa-router');
const home = new Router();
const PostSchema = require('../models/post');

home.get('/', async (ctx) => {
  //views가 많은 숫서의 게시물 5개를 뽑는다
  const popularityPost = await PostSchema.find().sort({ views: -1 }).limit(5);
  let postTitle = [];
  let postId = [];
  for (let i = 0; i <= popularityPost.length - 1; i++) {
    postTitle.push(popularityPost[i].title);
    postId.push(popularityPost[i]._id);
  }
  await ctx.render('home', {
    postTitle: postTitle,
    postId: postId,
  });
});

module.exports = home;
