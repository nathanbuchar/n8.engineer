const express = require('express');
const path = require('path');

const app = express();

app.use('/', express.static('dist', {
  dotfiles: 'allow',
}));

app.use((req, res) => {
  res.status(404);
  res.sendFile('not-found.html', {
    root: path.resolve('dist'),
  });
});

app.use((err, req, res) => {
  res.status(500);
  res.sendFile('error.html', {
    root: path.resolve('dist'),
  });
});

app.listen(process.env.PORT || 3000);
