import { CustomError } from './custom-error';

export class CurrentAdminForbidden extends CustomError {
  statusCode = 403;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, CurrentAdminForbidden.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
