import { AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';

export const googleLogin = (token: string) => {
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`;
    axios
      .get(url)
      .then(({ data }: AxiosResponse) => {
        if (data?.email && data?.name) {
          resolve(data);
        } else {
          reject({
            statusCode: 400,
            message: '토큰 정보가 올바르지 않습니다.',
          });
        }
      })
      .catch((_err: AxiosError) => {
        reject({ statusCode: 400, message: '토큰 정보가 올바르지 않습니다.' });
      });
  });
};
