import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const instance = axios.create({
  baseURL: 'https://dapi.kakao.com/v2',
  headers: { Authorization: 'KakaoAK 0192def710aae5afe025bd50dbf21e27' },
});

export default instance;
