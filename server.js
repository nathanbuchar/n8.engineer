const http = require('http');
const { Server } = require('node-static');

const fileServer = new Server('dist');

const server = http.createServer((req, res) => {
  req.addListener('end', () => {
    fileServer.serve(req, res, (err) => {
      if (err) {
        switch (err.status) {
          case 404:
            fileServer.serveFile('not-found.html', 404, {}, req, res);
            break;
          default:
            fileServer.serveFile('error.html', err.status, {}, req, res);
        }
      }
    });
  }).resume();
});

server.listen(process.env.PORT || 3000);
