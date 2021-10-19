const koa = require('koa');
const Pug = require('koa-pug');
const Router = require('koa-router');
const home = require('./api/home');
const login = require('./api/login');
const join = require('./api/join');
const path = require('path');
const serve = require('koa-static');
const app = new koa();
const router = new Router();
const PORT = 5000;
const bodyParser = require('koa-bodyparser');

new Pug({
  viewPath: path.resolve(__dirname, './html'),
  app,
});
router.use('/', home.routes());
router.use('/api', login.routes());
router.use('/api', join.routes());

app.use(bodyParser());
app.use(serve(__dirname + '/public'));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT, () => {
  console.log('server is open');
});
