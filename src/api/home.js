const Router = require('koa-router');
const home = new Router();
const PostSchema = require('../models/post');
const userSchema = require('../models/user');
const axios = require('axios');
const cheerio = require('cheerio');
let iconv = require('iconv-lite');
home.get('/', async (ctx) => {
  //views가 많은 숫서의 게시물 5개를 뽑는다
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
  //네이버 기사 크롤링
  const getHtml = async () => {
    try {
      return await axios({
        url: 'https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2=283',
        method: 'GET',
        responseType: 'arraybuffer',
      });
    } catch (error) {
      console.error(error);
    }
  };
  const html = await getHtml();
  const content = iconv.decode(html.data, 'EUC-KR').toString();
  let ulList = [];
  const $ = cheerio.load(content);
  const $bodyList = $('div.list_body ul.type06_headline').children('li');
  $bodyList.each(function (i, elem) {
    ulList[i] = {
      title: $(this).find('dt a').text(),
      url: $(this).find('dt a').attr('href'),
      image_url: $(this).find('dt a img').attr('src'),
      // image_alt: $(this).find('div.list_thumb a img').attr('alt'),
    };
  });
  // let dataTitle = ulList.filter((n) => n.title);
  const _newsDataTitle = newsPostTitle(ulList);
  const _newsPostUrl = newsPostUrl(ulList);
  const _newsPostImg = newsPostImg(ulList);
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
      newsDataTitle: _newsDataTitle,
      newsPostUrl: _newsPostUrl,
      newsPostImg: _newsPostImg,
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
      newsDataTitle: _newsDataTitle,
      newsPostUrl: _newsPostUrl,
      newsPostImg: _newsPostImg,
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
let resultTitle = [];
let resultUrl = [];
let resultImg = [];
function newsPostTitle(item) {
  for (let i = 0; i < item.length; i++) {
    resultTitle.push(item[i].title.trim());
  }
  return resultTitle;
}
function newsPostUrl(item) {
  for (let i = 0; i < item.length; i++) {
    resultUrl.push(item[i].url.trim());
  }
  return resultUrl;
}
function newsPostImg(item) {
  for (let i = 0; i < item.length; i++) {
    resultImg.push(item[i].image_url);
  }
  return resultImg;
}

module.exports = home;
