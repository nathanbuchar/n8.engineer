const Koa = require('koa');
const serve = require('koa-static');

const app = new Koa();

app.use(serve('dist'));

app.listen(process.env.PORT || 3000);
