import http from 'http';
import fs from 'fs';
import route from './routes.js';

fs.writeFile('./message.txt', 'Hello', 'utf-8', (error) => {
  if (error) {
    console.log('failed to write file', error);
    return;
  }
  console.log('file created successfully');
});

fs.readFile('./message.txt', 'utf-8', (error, content) => {
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

  const port = 3000;
  const host = 'localhost';

  server.listen(port, host, () => {
    console.log(`API running on http://${host}:${port}/`)
  });
}
