export const authType = (type: string) => {
  let authTypeNumber = 0;
  switch (type) {
    case 'google':
      authTypeNumber = 1;
      break;
    case 'facebook':
      authTypeNumber = 2;
      break;
    case 'kakao':
      authTypeNumber = 3;
      break;
    default:
      break;
  }
  return authTypeNumber;
};

export const dateReg = (date: string) => {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  return regEx.test(date);
};
