import { AxiosError, AxiosResponse } from 'axios';
import querystring from 'querystring';
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
