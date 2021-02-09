/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';

export const facebookLogin = (token: string) => {
  return new Promise((resolve, reject) => {
    const url = `https://graph.facebook.com/v2.3/me?access_token=${token}&fields=name,email,picture&locale=en_US&method=get&pretty=0&sdk=joey&suppress_http_code=1`;
    axios
      .get(url)
      .then(({ data }: AxiosResponse) => {
        if (data?.email && data?.name) {
          resolve({
            email: data.email,
            name: data.name,
            picture: data?.picture?.data?.url || '',
          });
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
