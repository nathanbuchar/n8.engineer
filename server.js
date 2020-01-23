const http = require('http');
const { Server } = require('node-static');

const fileServer = new Server('./dist');

const server = http.createServer((req, res) => {
  req.addListener('end', () => {
    fileServer.serve(req, res, (err) => {
      if (err && err.status === 404) {
        fileServer.serveFile('not-found.html', 404, {}, req, res);
      }
    });
  }).resume();
});

server.listen(process.env.PORT || 3000);
