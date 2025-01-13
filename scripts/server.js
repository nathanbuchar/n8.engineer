import express from 'express';

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://giscus.app');
  next();
});

app.use(express.static('dist', {
  dotfiles: 'allow',
}));

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
