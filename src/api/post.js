const { ObjectId } = require('bson');
const Router = require('koa-router');
const posts = new Router();
const PostSchema = require('../models/post');
const userSchema = require('../models/user');
const commentSchema = require('../models/comments');
const File = require('../models/file');
const auth = require('../middleware/auth');
const multer = require('koa-multer');
const upload = multer({
  dest: 'uploads/',
});
// 첫화면 만든 시간을 순서로 게시글을 가져옴
posts.get('/posts', async (ctx) => {
  const searchQuery = await createSearchQuery(ctx.query);
  const postTitle = 'any';
  let { _accessToken, _refreshToken } = await loadToken(ctx);
  let page = Math.max(1, parseInt(ctx.query.page));
  let limit = Math.max(1, parseInt(ctx.query.limit));
  page = !isNaN(page) ? page : 1;
  limit = !isNaN(limit) ? limit : 10;
  const skip = (page - 1) * limit;
  const count = await PostSchema.countDocuments({ searchQuery, postTitle });
  const maxPage = Math.ceil(count / limit);
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  const _posts = await PostSchema.aggregate([
    { $match: { $and: [{ postTitle }, searchQuery] } },
    {
      $lookup: {
        from: 'users',
        localField: 'writer',
        foreignField: 'id',
        as: 'writer',
      },
    },
    { $unwind: '$writer' },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'comments',
        localField: 'id',
        foreignField: 'post',
        as: 'comments',
      },
    },

    {
      $project: {
        title: 1,
        writer: {
          id: 1,
        },
        views: 1,
        numId: 1,
        createdAt: 1,
        commentCount: { $size: '$comments' },
      },
    },
  ]).exec();
  if (user) {
    await ctx.render('posts/index', {
      posts: _posts,
      actoken: _accessToken,
      name: user.name,
      currentPage: page,
      maxPage: maxPage,
      limit: limit,
      searchType: ctx.query.searchType,
      searchText: ctx.query.searchText,
      id: user.id,
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
  let { _accessToken, _refreshToken } = await loadToken(ctx);
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
posts.post('/posts', auth, upload.single('img'), async (ctx) => {
  let { _accessToken, _refreshToken } = await loadToken(ctx);
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  const _posts = await PostSchema.find({}).sort('-createAt').exec();
  let data = ctx.req.body;
  const attachment = ctx.req.file
    ? await File.createNewInstance(ctx.req.file, data.writer)
    : undefined;
  data.attachment = attachment;
  const { _id } = await PostSchema.create(data);
  if (attachment) {
    attachment.postId = _id;
    attachment.save();
  }
  await PostSchema.findOneAndUpdate(
    { _id: _id },
    {
      $set: {
        id: _id,
      },
    },
    { upsert: true }
  );
  if (user) {
    await ctx.redirect('/api/posts', {
      posts: _posts,
      acToken: _accessToken,
      name: user.name,
      id: user.id,
    });
  } else {
    ctx.res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    ctx.res.write("<script>alert('작성에 실패하였습니다.')</script>");
    await ctx.redirect('/api/posts', {
      posts: _posts,
      acToken: _accessToken,
      name: user.name,
    });
  }
});

//작성글 확인
posts.get('/posts/:id', auth, async (ctx) => {
  let { _accessToken, _refreshToken } = await loadToken(ctx);
  const data = ctx.params;
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  const post = await PostSchema.findOne({ _id: ObjectId(data.id) })
    .populate({ path: 'writer', select: 'username' })
    .populate({ path: 'attachment', match: { isDeleted: false } })
    .exec();
  const comments = await commentSchema
    .find({ post: ObjectId(data.id) })
    .sort('createdAt')
    .exec();
  post.views++;
  post.save();
  if (user) {
    await ctx.render('posts/show', {
      post: post,
      userId: user.id,
      acToken: _accessToken,
      name: user.name,
      writer: post.writer,
      comments: comments,
      id: user.id,
    });
  } else {
    ctx.res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    ctx.res.write("<script>alert('작성글을 확인 하실 수 없습니다.')</script>");
    await ctx.redirect('/api/posts', {
      posts: _posts,
      acToken: _accessToken,
      name: user.name,
    });
  }
});

// 편집
posts.get('/posts/:id/edit', auth, async (ctx) => {
  let { _accessToken, _refreshToken } = await loadToken(ctx);
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  const data = ctx.params;
  const post = await PostSchema.findOne({ _id: ObjectId(data.id) }).exec();
  if (user) {
    await ctx.render('posts/edit', {
      post: post,
      acToken: _accessToken,
      name: user.name,
      postId: post.id,
      id: user.id,
    });
  } else {
    ctx.res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    ctx.res.write("<script>alert('편집 하실 수 없습니다.')</script>");
    await ctx.redirect('/api/posts', {
      posts: _posts,
      acToken: _accessToken,
      name: user.name,
    });
  }
});

//업데이트
posts.post('/posts/:id', auth, async (ctx) => {
  const data = ctx.request.body;
  let { _accessToken, _refreshToken } = await loadToken(ctx);
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
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
      id: user.id,
    });
  } else {
    ctx.res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    ctx.res.write("<script>alert('업데이트에 실패하였습니다.')</script>");
    await ctx.redirect('/api/posts', {
      posts: _posts,
      acToken: _accessToken,
      name: user.name,
    });
  }
});

//삭제
posts.post('/posts/:id/delete', auth, async (ctx) => {
  let { _accessToken, _refreshToken } = await loadToken(ctx);
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  const param = ctx.params;
  await PostSchema.deleteOne({ _id: ObjectId(param.id) });
  const _posts = await PostSchema.find({}).sort('-createdAt').exec();

  if (user) {
    await ctx.redirect('/api/posts', {
      posts: _posts,
      acToken: _accessToken,
      name: user.name,
      id: user.id,
    });
  } else {
    ctx.res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    ctx.res.write("<script>alert('삭제에 실패하였습니다.')</script>");
    await ctx.redirect('/api/posts', {
      posts: _posts,
      acToken: _accessToken,
      name: user.name,
    });
  }
});
//파일 다운
posts.get('/posts/:serverFileName/:originalFileName', async function (ctx) {
  const param = ctx.params;
  const file = await File.findOne({
    serverFileName: param.serverFileName,
    originalFileName: param.originalFileName,
  });

  let stream = await file.getFileStream();
  if (stream) {
    ctx.response.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition':
        'attachment; filename=' + encodeURI(file.originalFileName),
    });
    ctx.body = stream;
  } else {
    ctx.res.statusCode = 404;
    ctx.res.end();
  }
});

async function createSearchQuery(queries) {
  var searchQuery = {};
  if (
    queries.searchType &&
    queries.searchText &&
    queries.searchText.length >= 3
  ) {
    // 1
    var searchTypes = queries.searchType.toLowerCase().split(',');
    var postQueries = [];
    if (searchTypes.indexOf('title') >= 0) {
      postQueries.push({
        title: { $regex: new RegExp(queries.searchText, 'i') },
      });
    }
    if (searchTypes.indexOf('body') >= 0) {
      postQueries.push({
        body: { $regex: new RegExp(queries.searchText, 'i') },
      });
    }
    if (postQueries.length > 0) searchQuery = { $or: postQueries };
  }
  return searchQuery;
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

async function bytesToSize() {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

module.exports = posts;
