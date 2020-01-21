const express = require('express');
const path = require('path');

const app = express();

app.use('/', [
  express.static('dist/home'),
  express.static('dist', {
    dotfiles: 'allow',
  }),
]);

app.get('*', (req, res) => {
  const errorPage = path.join(__dirname, 'dist/error/index.html');

  res.status(404);
  res.sendFile(errorPage);
});

app.listen(process.env.PORT || 3000);
