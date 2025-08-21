import http from 'http';

function bootstrap() {
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain; charset=utf-8');
    res.end("Hello");
  });

  const host = 'localhost';
  const port = 3000;

  server.listen(port, host, () => {
    console.log(`API rodando em http://${host}:${port}/`);
  });
}

bootstrap();