import http from 'http';
import fs from 'fs';
import route from './routes.js';
import sqlite3 from 'sqlite3';
import { sequelize, createRequest, getAllRequests, getByIdRequest } from './models.js';

const db = new sqlite3.Database('./dev.db', (error) => {
  if (error) {
    console.log('failed to connect to database', error);
    return;
  }
  console.log('connected to database');
});

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

async function bootstrap(content) {
  await sequelize.sync();
  await createRequest({
    totalValue: 200.00,
    products: [
      {
        id: 6,
        quantity: 3
      },
      {
        id: 7,
        quantity: 1
      }
    ]
  });

  await getAllRequests();


  const server = http.createServer((req, res) => {
    route(req, res, { content });
  });

  const port = 3000;
  const host = 'localhost';

  server.listen(port, host, () => {
    console.log(`API running on http://${host}:${port}/`)
  });
}
