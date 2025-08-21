import http from 'http';
import fs from 'fs';
import route from './routes.js';

fs.writeFile('./msg.txt', 'Hello', 'utf-8', (error) => {
  if (error) {
    console.log('failed to write file', error);
    return;
  }
  console.log('file created successfully');
});

fs.readFile('./msg.txt', 'utf-8', (error, content) => {
  if (error) {
    console.log('failed to read file', error);
    return;
  }
  console.log(`content: ${content}`);
  bootstrap(content);
});

function bootstrap(content) {
  const server = http.createServer((req, res) => {
    route(req, res, { content });
  });

  const host = 'localhost';
  const port = 3000;

  server.listen(port, host, () => {
    console.log(`API rodando em http://${host}:${port}/`);
  });
}
