const errorCodes: Record<string, string> = {
  'error.job.not.found': $localize`:@@error.jobNotFound:Job with this ID not found.`,
  'error.person.not.found': $localize`:@@error.personNotFound:Person with this ID not found.`,
  'error.method.violation': $localize`:@@error.methodViolation:Method violation occurred.`,
  'error.validation.failed': $localize`:@@error.validationFailed:Validation failed. Check the input data!`,
  'error.invalid.credentials': $localize`:@@error.invalidCredentials:Invalid credentials provided.`,
  'error.access.denied': $localize`:@@error.accessDenied:You don't have permission to perform this action.`,
  'error.job.not.done.or.already.pickedup': $localize`:@@error.jobNotDoneOrAlreadyPickedUp:Job is not done or already picked up.`,
  'error.system.setting.required.missing': $localize`:@@error.systemSettingRequiredMissing:Required system setting is missing. Please reload the site and contact the maintainer.`,
  'error.system.setting.not.found': $localize`:@@error.systemSettingNotFound:System setting not found.`,
  'error.image.id.not.found.for.attach': $localize`:@@error.imageIdNotFoundForAttach:Image was not found. Please reload the site and contact the maintainer.`,
  'error.image.already.linked.to.job': $localize`:@@error.imageAlreadyLinkedToJob:Image is already linked to another job. Please reload the site and contact the maintainer.`,
  'error.unsupported.filetype': $localize`:@@error.unsupportedFiletype:Unsupported file type. Only JPG, PNG and GIF are supported.`,
};

export default class ErrorCodeTranslator {
  static translateErrorCode(errorCode: string): string {
    return errorCodes[errorCode] || errorCode;
  }
}
