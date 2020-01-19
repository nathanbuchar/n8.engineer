const express = require('express');

const app = express();

app.use('/', [
  express.static('dist', {
    dotfiles: 'allow',
  }),
  express.static('dist/home'),
]);

app.listen(process.env.PORT || 3000);
