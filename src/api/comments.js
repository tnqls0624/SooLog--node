const Router = require('koa-router');
const comments = new Router();
const commentSchema = require('../models/comments');
const postSchema = require('../models/post');

comments.post('/comments', async (ctx) => {
  const post = getPost(ctx);
  ctx.request.body.author = post.id;
  ctx.request.body.post = post.id;
});

module.exports = comments;

async function getPost(ctx) {
  const data = ctx.params;
  const post = await PostSchema.findOne({ _id: ObjectId(data.id) }).exec();
  return post;
}
