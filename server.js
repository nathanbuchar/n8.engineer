const express = require('express');

const app = express();

app.use('/', [
  express.static('dist'),
  express.static('dist/home'),
]);

app.use('/', express.static('static', {
  dotfiles: 'allow',
}));

app.listen(process.env.PORT || 3000);
