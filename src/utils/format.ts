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
  const regEx = /^([0-9]{4})[./-]([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])$/;
  return regEx.test(date);
};

export const phoneNumberReg = (phoneNumber: string) => {
  const regEx = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g;
  return regEx.test(phoneNumber);
};

export const linkReg = (link: string) => {
  const regEx = /(https?:\/\/[^\s]+)/g;
  return regEx.test(link);
};
