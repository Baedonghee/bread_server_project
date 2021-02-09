/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AxiosError, AxiosResponse } from 'axios';
import querystring from 'querystring';
import axios from 'axios';
import axiosKaKao from '../utils/axios-kakao';

export const kakaoAddress = (lon: number, lat: number) => {
  return new Promise((resolve, reject) => {
    axiosKaKao
      .get(`/local/geo/coord2address.json?x=${lon}&y=${lat}`)
      .then(({ data: { documents } }: AxiosResponse) => {
        const roadAddress: string = documents[0].road_address
          ? (documents[0].road_address.address_name as string)
          : '';
        const zibunAddress: string = documents[0].address
          ? (documents[0].address.address_name as string)
          : '';
        resolve({
          roadAddress,
          zibunAddress,
        });
      })
      .catch((err: AxiosError) => {
        reject(err);
      });
  });
};

export const kakaoLocalAddress = (query: string, page = 1, size = 1) => {
  const queryBuilder = {
    query,
    page,
    size,
  };
  const queryData = querystring.stringify(queryBuilder);
  const url = `/local/search/address.json?${queryData}`;
  return new Promise((resolve, reject) => {
    axiosKaKao
      .get(url)
      .then(({ data }: AxiosResponse) => {
        resolve(data);
      })
      .catch((err: AxiosError) => {
        reject(err);
      });
  });
};

export const kakaoLogin = (token: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data: { kakao_account } }: AxiosResponse) => {
        if (kakao_account?.email && kakao_account?.profile?.nickname) {
          resolve({
            email: kakao_account?.email,
            name: kakao_account?.profile?.nickname,
            imageUrl: kakao_account?.profile?.profile_image_url,
          });
        } else {
          reject({
            statusCode: 400,
            message: '토큰 정보가 올바르지 않습니다.',
          });
        }
      })
      .catch((_err) => {
        reject({ statusCode: 400, message: '토큰 정보가 올바르지 않습니다.' });
      });
  });
};
