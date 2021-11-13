const koa = require('koa');
const Pug = require('koa-pug');
const Router = require('koa-router');
const home = require('./api/home');
const login = require('./api/login');
const join = require('./api/join');
const myPage = require('./api/mypage');
const logout = require('./api/logout');
const comments = require('./api/comments');
const game = require('./api/game');
const path = require('path');
const db = require('./DBC');
const posts = require('./api/post');
const serve = require('koa-static');
const app = new koa();
const router = new Router();
const PORT = 5000;
const bodyParser = require('koa-bodyparser');
//퍼그
new Pug({
  viewPath: path.resolve(__dirname, './html'),
  app,
});
//라우터
router.use('/', home.routes());
router.use('/api', login.routes());
router.use('/api', join.routes());
router.use('/api', myPage.routes());
router.use('/api', logout.routes());
router.use('/api', posts.routes());
router.use('/api', comments.routes());
router.use('/api', game.routes());
//미들웨어
app.use(bodyParser());
db();
app.use(serve(__dirname + '/public'));
app.use(serve(__dirname + '/img'));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT, () => {
  console.log('server is open');
});
