import { ErrorTypes } from './enums/error-types';

export class ErrorResponse {
  constructor(
    public errorType: ErrorTypes,
    public path: string,
    public status: number,
    public timestamp: string,
    public message: string,
    public errorKey: string,
    public errorCode: string
  ) {}
}
