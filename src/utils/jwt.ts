import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

// PRIVATE and PUBLIC key
const adminPrivateKEY = fs.readFileSync(
  path.join(__dirname, '../config/admin_private.key'),
  'utf8'
);

const userPrivateKEY = fs.readFileSync(
  path.join(__dirname, '../config/user_private.key'),
  'utf8'
);

export const adminJwt = (
  id: number,
  email: string,
  name: string,
  imageUrl: string
) => {
  return new Promise((resolve, reject) => {
    if (!adminPrivateKEY) {
      reject('jwt key not exist');
    }
    const adminJwt = jwt.sign(
      {
        id,
        email,
        name,
        imageUrl,
      },
      adminPrivateKEY,
      {
        algorithm: 'RS256',
      }
    );
    resolve(adminJwt);
  });
};

export const userJwt = (
  id: number,
  email: string,
  name: string,
  imageUrl: string
) => {
  return new Promise((resolve, reject) => {
    if (!userPrivateKEY) {
      reject('jwt key not exist');
    }
    const userJwt = jwt.sign(
      {
        id,
        email,
        name,
        imageUrl,
      },
      userPrivateKEY,
      {
        algorithm: 'RS256',
      }
    );
    resolve(userJwt);
  });
};
