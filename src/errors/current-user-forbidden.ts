import { CustomError } from './custom-error';

export class CurrentUserForbidden extends CustomError {
  statusCode = 403;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, CurrentUserForbidden.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
