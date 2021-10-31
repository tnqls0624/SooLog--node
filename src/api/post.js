const Router = require('koa-router');
const post = new Router();
const PostSchema = require('../models/post');

post.get('/post', async (ctx) => {});

module.exports = post;
