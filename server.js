const Koa = require('koa');
const serve = require('koa-static');

const app = new Koa();

app.use(serve('dist', {
  hidden: true, // Serve .well-known
}));

app.listen(process.env.PORT || 3000);
