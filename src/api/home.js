const Router = require('koa-router');
const home = new Router();
const PostSchema = require('../models/post');
const userSchema = require('../models/user');
const axios = require('axios');
const cheerio = require('cheerio');
home.get('/', async (ctx) => {
  //views가 많은 숫서의 게시물 5개를 뽑는다
  let resultList = [];
  let cnt = 0;
  const popularityPost_any = await popularityPost('any');
  const newPost_any = await newPost('any');
  const { postTitle: postTitle_any, postId: postId_any } =
    await distinguishPost(popularityPost_any);
  const _newPost_any = await distinguishPost(newPost_any);
  const popularityPost_game = await popularityPost('game');
  const newPost_game = await newPost('game');
  const { postTitle: postTitle_game, postId: postId_game } =
    await distinguishPost(popularityPost_game);
  const _newPost_game = await distinguishPost(newPost_game);
  let { _accessToken, _refreshToken } = await loadToken(ctx);
  const user = await userSchema.findOne({ rfToken: _refreshToken }).exec();

  const getHtml = async () => {
    try {
      return await axios.get(
        'https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2=283'
      );
    } catch (error) {
      console.error(error);
    }
  };
  getHtml()
    .then((html) => {
      let ulList = [];
      const $ = cheerio.load(html.data);
      const $bodyList = $('div.list_body ul.type06_headline').children('li');
      $bodyList.each(function (i, elem) {
        ulList[i] = {
          title: $(this).find('dt a').text(),
          // url:
          //   'search.naver.com/search.naver' +
          //   $(this).find('div.list_title a').attr('href'),
          // image_url: $(this).find('div.list_thumb a img').attr('src'),
          // image_alt: $(this).find('div.list_thumb a img').attr('alt'),
        };
      });
      const data = ulList.filter((n) => n.title);
      return data;
    })
    .then((res) => {
      console.log(res);
    });

  if (user) {
    await ctx.render('home', {
      actoken: _accessToken,
      name: user.name,
      id: user.id,
      postTitle_any: postTitle_any,
      postId_any: postId_any,
      newPostTitle_any: _newPost_any.postTitle,
      newPostId_any: _newPost_any.postId,
      postTitle_game: postTitle_game,
      postId_game: postId_game,
      newPostTitle_game: _newPost_game.postTitle,
      newPostId_game: _newPost_game.postId,
    });
  } else {
    await ctx.render('home', {
      postTitle_any: postTitle_any,
      postId_any: postId_any,
      newPostTitle_any: _newPost_any.postTitle,
      newPostId_any: _newPost_any.postId,
      postTitle_game: postTitle_game,
      postId_game: postId_game,
      newPostTitle_game: _newPost_game.postTitle,
      newPostId_game: _newPost_game.postId,
    });
  }
});

async function distinguishPost(post) {
  let postTitle = [];
  let postId = [];
  for (let i = 0; i <= post.length - 1; i++) {
    postTitle.push(post[i].title);
    postId.push(post[i]._id);
  }
  return { postTitle, postId };
}
async function popularityPost(title) {
  const popularityPost = await PostSchema.find({ postTitle: title })
    .sort({ views: -1 })
    .limit(5);
  return popularityPost;
}
async function newPost(title) {
  const newPost = await PostSchema.find({ postTitle: title })
    .sort({ createdAt: -1 })
    .limit(5);
  return newPost;
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
