import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateIdentityException extends HttpException {
  constructor(message: string = 'Duplicate identity detected') {
    super(message, HttpStatus.CONFLICT);
  }
}
