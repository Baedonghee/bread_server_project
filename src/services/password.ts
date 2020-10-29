import bcrypt from 'bcrypt';

export class Password {
  static toHash(password: string) {
    const saltRounds = 10;
    return new Promise<string>((resolve, reject) => {
      void bcrypt.hash(password, saltRounds, (err, hash: string) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  }
  static toCompare(password: string, hashPassword: string) {
    return new Promise<boolean>((resolve, reject) => {
      void bcrypt.compare(password, hashPassword, (err, result: boolean) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }
}
