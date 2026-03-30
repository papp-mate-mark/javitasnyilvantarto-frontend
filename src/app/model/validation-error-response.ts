import { ErrorResponse } from './error-response';
import { ValidationFieldError } from './validation-field-error';

export class ValidationErrorResponse extends ErrorResponse {
  public fieldErrors: ValidationFieldError[] = [];
}
