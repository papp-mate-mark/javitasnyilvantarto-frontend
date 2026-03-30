export class ValidationFieldError {
  constructor(public fieldName: string, public messageKey: string, public errorCode: string) {}
}
