import jwt from 'jsonwebtoken';

export const userJwt = (
  id: number,
  email: string,
  name: string,
  imageUrl: string
) => {
  return new Promise((resolve, reject) => {
    if (!process.env.JWT_KEY) {
      reject('jwt key not exist');
    }
    const userJwt = jwt.sign(
      {
        id,
        email,
        name,
        imageUrl,
      },
      process.env.JWT_KEY || ''
    );
    resolve(userJwt);
  });
};
