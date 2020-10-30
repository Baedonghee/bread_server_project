import { CustomError } from './custom-error';

export class GoneRequestError extends CustomError {
  statusCode = 410;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, GoneRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
