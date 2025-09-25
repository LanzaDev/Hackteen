import sqlite3 from 'sqlite3';
import express from 'express';
import { sequelize } from './models.js';

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

async function bootstrap() {
  const database = new sqlite3.Database('./dev.db', (error) => {
    if (error) {
      console.log('failed to connect to database', error);
      return;
    }
    console.log('connected to database');
  });

  await sequelize.sync();
  
  const port = 3000;
  const host = 'localhost';

  app.listen(port);
  console.log(`listening on http://${host}:${port}`);
}

bootstrap();