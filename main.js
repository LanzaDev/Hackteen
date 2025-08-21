import http from 'http';
import fs from 'fs';

fs.writeFile('./msg.txt', 'Hello', 'utf-8', (error) => {
  if (error) {
    console.log('Fail', error);
    return;
  }
  console.log('Done');
});

fs.readFile('./msg.txt', 'utf-8', (error, content) => {
  if (error) {
    console.log('Fail', error);
    return;
  }
  console.log(`Content: ${content}`);
  bootstrap(content);
});

function bootstrap(msg) {
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain; charset=utf-8');
    res.end(msg);
  });

  const host = 'localhost';
  const port = 3000;

  server.listen(port, host, () => {
    console.log(`API rodando em http://${host}:${port}/`);
  });
}
