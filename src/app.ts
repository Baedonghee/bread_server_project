import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { AdminUser } from './entity/Admin_User';
import { format } from 'date-fns';

createConnection()
  .then(async (connection) => {
    console.log('Database Connected :)');
    console.log('Inserting a new user into the database...');
    // const admin_user = new AdminUser();
    // admin_user.email = 'qoehdgml3@naver.com';
    // admin_user.password = 'qwe';
    // admin_user.type = 1;
    // await connection.manager.save(admin_user);
    // console.log('Saved a new user with id: ' + admin_user.id);
    console.log('Loading users from the database...');
    // console.log(new Date());
    const users = await connection.manager.find(AdminUser);
    console.log('Loaded users: ', users);
    console.log(format(users[0].createdAt, 'yyyyMMddhhmmss'));
    console.log('Here you can setup and run express/koa/any other framework.');
  })
  .catch((error) => console.log(error));

const app = express();
app.use(compression());
app.use(bodyParser());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(morgan('dev'));

export { app };
