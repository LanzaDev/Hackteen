import http from 'http';
import fs from 'fs';
import route from './routes.js';
import sqlite3 from 'sqlite3';
import { sequelize, createProduct, readAllProducts, readByIdProduct, updateProduct, deleteProduct } from './models.js';

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
  await createProduct({ name: 'banana', price: 10.50 })
  await createProduct({ name: 'apple', price: 11.50 })
  await readAllProducts();
  await readByIdProduct(2);
  await readByIdProduct(29);
  await updateProduct(4, { price: 2.50 });
  await deleteProduct(3);


  const server = http.createServer((req, res) => {
    route(req, res, { content });
  });

  const port = 3000;
  const host = 'localhost';

  server.listen(port, host, () => {
    console.log(`API running on http://${host}:${port}/`)
  });
}
