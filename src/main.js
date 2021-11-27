const koa = require('koa');
const Pug = require('koa-pug');
const Router = require('koa-router');
const home = require('./api/home');
const login = require('./api/login');
const join = require('./api/join');
const myPage = require('./api/mypage');
const logout = require('./api/logout');
const ChatSchema = require('./models/chat');
const comments = require('./api/comments');
const game = require('./api/game');
const chat = require('./api/chat');
const websockify = require('koa-websocket');
const path = require('path');
const db = require('./DBC');
const posts = require('./api/post');
const serve = require('koa-static');
const app = websockify(new koa());
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

app.ws.use(
  router.all('/ws', async (ctx) => {
    const chatsCursor = await ChatSchema.find({}).sort({ createdAt: -1 });

    const chats = await chatsCursor.toArray();
    ctx.websocket.send(
      JSON.stringify({
        type: 'sync',
        payload: {
          chats,
        },
      })
    );

    ctx.websocket.on('message', async (data) => {
      if (typeof data !== 'string') {
        return;
      }

      const chat = JSON.parse(data);

      await ChatSchema.insertOne({
        ...chat,
        createdAt: new Date(),
      });

      const { nickname, message } = chat;

      const { server } = app.ws;

      if (!server) {
        return;
      }

      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'chat',
            payload: {
              message,
              nickname,
            },
          })
        );
      });
    });
  })
);

app.listen(PORT, () => {
  console.log('server is open');
});
