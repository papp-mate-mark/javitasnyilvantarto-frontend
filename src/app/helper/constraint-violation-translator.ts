const methodViolationMessages: Record<string, string> = {}; //Currently empty, not sure if needed

export const translateMethodViolationMessages = (errorCode: string) => {
  return methodViolationMessages[errorCode] || errorCode;
};
