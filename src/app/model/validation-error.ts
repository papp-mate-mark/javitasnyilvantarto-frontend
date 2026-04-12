export interface ValidationError {
  fieldName: string;
  message: string;
}

export interface ValidationResponse {
  errors: ValidationError[];
}
