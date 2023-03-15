import handler from 'serve-handler';
import http from 'http';

const server = http.createServer((req, res) => {

  // Allows CORS requests from Giscus.
  res.setHeader('Access-Control-Allow-Origin', 'https://giscus.app');

  return handler(req, res, {
    public: 'dist',
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000...');
});
