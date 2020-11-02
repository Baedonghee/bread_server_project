import { CustomError } from './custom-error';

export class ValidateFileError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, ValidateFileError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
