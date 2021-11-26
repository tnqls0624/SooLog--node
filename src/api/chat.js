const koa = require('koa');
const Router = require('koa-router');
const chats = new Router();
const websockify = require('koa-websocket');
const app = websockify(new Koa());

app.ws.use(chats.all('/chat', async (ctx) => {}));

module.exports = chats;
