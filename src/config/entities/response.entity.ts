import { HttpException, HttpStatus } from '@nestjs/common';

export class ResponseEntity<TData = object> {
  statusCode: HttpStatus;
  message: string;
  data: TData;

  constructor(statusCode: HttpStatus, message: string, data?: TData) {
    if (statusCode > 299) {
      throw new HttpException(message, statusCode);
    }
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
