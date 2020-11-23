import axiosKaKao from '../utils/axios-kakao';

export const kakaoAddress = (lon: number, lat: number) => {
  return new Promise((resolve, reject) => {
    axiosKaKao
      .get(`/local/geo/coord2address.json?x=${lon}&y=${lat}`)
      .then(({ data: { documents } }: any) => {
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
      .catch((err: any) => {
        reject(err);
      });
  });
};
