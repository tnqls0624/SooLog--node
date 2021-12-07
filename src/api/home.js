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
  const {
    postTitle: postTitle_any,
    postId: postId_any,
    postBody: postBody_any,
  } = await distinguishPost(popularityPost_any);
  const {
    postTitle: newPostTitle_any,
    postId: newPostId_any,
    postBody: newPostBody_any,
  } = await distinguishPost(newPost_any);
  const popularityPost_game = await popularityPost('game');
  const newPost_game = await newPost('game');
  const {
    postTitle: postTitle_game,
    postId: postId_game,
    postBody: postBody_game,
  } = await distinguishPost(popularityPost_game);
  const {
    postTitle: newPostTitle_game,
    postId: newPostId_game,
    postBody: newPostBody_game,
  } = await distinguishPost(newPost_game);
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
      //자유게시판 인기
      postTitle_any: postTitle_any,
      postId_any: postId_any,
      postBody_any: postBody_any,
      //자유게시판 새로운
      newPostTitle_any: newPostTitle_any,
      newPostId_any: newPostId_any,
      newPostBody_any: newPostBody_any,
      //게임게시판 인기
      postTitle_game: postTitle_game,
      postId_game: postId_game,
      postBody_game: postBody_game,
      //게임게시판 새로운
      newPostTitle_game: newPostTitle_game,
      newPostId_game: newPostId_game,
      newPostBody_game: newPostBody_game,
      //네이버 뉴스기사
      newsDataTitle: _newsDataTitle,
      newsPostUrl: _newsPostUrl,
      newsPostImg: _newsPostImg,
    });
  } else {
    await ctx.render('home', {
      postTitle_any: postTitle_any,
      postId_any: postId_any,
      postBody_any: postBody_any,
      //자유게시판 새로운
      newPostTitle_any: newPostTitle_any,
      newPostId_any: newPostId_any,
      newPostBody_any: newPostBody_any,
      //게임게시판 인기
      postTitle_game: postTitle_game,
      postId_game: postId_game,
      postBody_game: postBody_game,
      //게임게시판 새로운
      newPostTitle_game: newPostTitle_game,
      newPostId_game: newPostId_game,
      newPostBody_game: newPostBody_game,
      //네이버 뉴스기사
      newsDataTitle: _newsDataTitle,
      newsPostUrl: _newsPostUrl,
      newsPostImg: _newsPostImg,
    });
  }
});

async function distinguishPost(post) {
  let postTitle = [];
  let postId = [];
  let postBody = [];
  for (let i = 0; i <= post.length - 1; i++) {
    postTitle.push(post[i].title);
    postId.push(post[i]._id);
    postBody.push(post[i].body);
  }
  return { postTitle, postId, postBody };
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
