import { ErrorResponse } from './error-response';

export default class MethodViolationErrorResponse extends ErrorResponse {
  public violationDetails: string[] = [];
}
