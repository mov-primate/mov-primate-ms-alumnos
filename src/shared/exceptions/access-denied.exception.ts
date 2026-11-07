import { HttpException, HttpStatus } from '@nestjs/common';

export class AccessDeniedException extends HttpException {
  constructor(message: string = 'Access denied') {
    super(message, HttpStatus.FORBIDDEN);
  }
}
