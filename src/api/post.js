const { ObjectId } = require('bson');
const Router = require('koa-router');
const posts = new Router();
const PostSchema = require('../models/post');
const userSchema = require('../models/user');
const commentSchema = require('../models/comments');
const auth = require('../middleware/auth');
// 첫화면 만든 시간을 순서로 게시글을 가져옴
posts.get('/posts', async (ctx) => {
  const searchQuery = await createSearchQuery(ctx.query);
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  let page = Math.max(1, parseInt(ctx.query.page));
  let limit = Math.max(1, parseInt(ctx.query.limit));
  page = !isNaN(page) ? page : 1;
  limit = !isNaN(limit) ? limit : 10;
  const skip = (page - 1) * limit;
  const count = await PostSchema.countDocuments(searchQuery);
  const maxPage = Math.ceil(count / limit);
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  const _posts = await PostSchema.find(searchQuery)
    .populate('writer')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .exec();
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
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  const _posts = await PostSchema.find({}).sort('-createAt').exec();
  const data = ctx.request.body;
  await PostSchema.create(data);
  if (user) {
    await ctx.redirect('/api/posts', {
      posts: _posts,
      acToken: _accessToken,
      name: user.name,
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
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const data = ctx.params;
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  const post = await PostSchema.findOne({ _id: ObjectId(data.id) }).exec();
  const comments = await commentSchema
    .find({ post: ObjectId(data.id) })
    .sort('createdAt')
    .exec();
  const commentTrees = await convertToTrees(
    comments,
    '_id',
    'parentComment',
    'childComment'
  );
  console.log(comments);
  if (user) {
    await ctx.render('posts/show', {
      post: post,
      userId: user.id,
      acToken: _accessToken,
      name: user.name,
      writer: post.writer,
      comments: commentTrees,
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
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
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
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
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
  let _accessToken = ctx.cookies.get('access_token');
  let _refreshToken = ctx.cookies.get('refresh_token');
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();
  const param = ctx.params;
  await PostSchema.deleteOne({ _id: ObjectId(param.id) });
  const _posts = await PostSchema.find({}).sort('-createdAt').exec();

  if (user) {
    await ctx.redirect('/api/posts', {
      posts: _posts,
      acToken: _accessToken,
      name: user.name,
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

async function convertToTrees(
  array,
  idFieldName,
  parentIdFiledName,
  childrenFiledName
) {
  let cloned = array.slice();

  for (let i = cloned.length - 1; i > -1; i--) {
    const parentId = cloned[i][parentIdFiledName];

    if (parentId) {
      const filtered = array.filter((elem) => {
        return elem[idFieldName].toString() == parentId.toString();
      });

      if (filtered.length) {
        const parent = filtered[0];

        if (parent[childrenFiledName]) {
          parent[childrenFiledName].unshift(cloned[i]);
        } else {
          parent[childrenFiledName] = [cloned[i]];
        }
      }
      cloned.splice(i, 1);
    }
  }
  return cloned;
}

module.exports = posts;
