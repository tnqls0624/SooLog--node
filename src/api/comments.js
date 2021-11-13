const { ObjectId } = require('bson');
const Router = require('koa-router');
const comments = new Router();
const commentSchema = require('../models/comments');
const userSchema = require('../models/user');
const postSchema = require('../models/post');

comments.post('/comments/:id', async (ctx) => {
  const data = ctx.request.body;
  const param = ctx.params;
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const post = await getPost(param);
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  const result = {
    post: post._id,
    writer: user.id,
    text: data.text,
    parentComment: data.parentComment || null,
  };
  const CS = await commentSchema.create(result);
  if (data.parentComment) {
    await commentSchema.findOneAndUpdate(
      { _id: ObjectId(data.parentComment) },
      {
        $addToSet: {
          childComment: CS.id,
        },
      }
    );
  }
  ctx.redirect(`/api/posts/${post._id}`);
});

comments.post('/comments/:id/edit', async (ctx) => {
  const data = ctx.request.body;
  const param = ctx.params;
  const post = await getPost(param);
  const updatedAt = Date.now();
  await commentSchema.findOneAndUpdate(
    { _id: ObjectId(data.commentId) },
    {
      $set: {
        text: data.text,
        updatedAt: updatedAt,
      },
    },
    { upsert: true }
  );
  ctx.redirect(`/api/posts/${post._id}`);
});

comments.post('/comments/:id/delete', async (ctx) => {
  const data = ctx.request.body;
  const param = ctx.params;
  const post = await getPost(param);
  await commentSchema.deleteOne({
    _id: ObjectId(data.commentId),
  });
  ctx.redirect(`/api/posts/${post._id}`);
});

module.exports = comments;

async function getPost(param) {
  const post = await postSchema.findOne({ _id: ObjectId(param.id) }).exec();
  return post;
}
