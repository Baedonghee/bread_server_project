import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from './docs/swagger.json';
import adminRouter from './routes/admin-user';
import noticeRouter from './routes/admin-notice';
import eventRouter from './routes/admin-event';
import shopRouter from './routes/admin-shop';
import youtubeRouter from './routes/admin-youtube';
import breadShopRouter from './routes/admin-bread-shop';
import uploadRouter from './routes/image-upload';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';

createConnection({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'mercuryeunoia_dev',
  synchronize: true,
  logging: false,
  timezone: '+09:00',
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
})
  .then(() => {
    console.log('Database Connected :)');
  })
  .catch((error) => console.log(error));

const app = express();
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(morgan('dev'));
app.use('/admin', adminRouter);
app.use('/admin/notice', noticeRouter);
app.use('/admin/event', eventRouter);
app.use('/admin/shop', shopRouter);
app.use('/admin/youtube', youtubeRouter);
app.use('/admin/bread/shop', breadShopRouter);
app.use('/upload', uploadRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.all('*', (_req, _res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
