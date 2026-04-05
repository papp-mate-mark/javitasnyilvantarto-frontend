const validationErrorMessages: Record<string, string> = {
  'generat-internal.server.error': $localize`:@@validationErrors.internalServerError:An internal server error occurred. Please try again later.`,
  'validation.email.invalid': $localize`:@@validationErrors.emailInvalid:The email address is not valid.`,
  'validation.required': $localize`:@@validationErrors.required:This field is required.`,
  'validation.password.too.short': $localize`:@@validationErrors.passwordTooShort:Password must be at least 8 characters long.`,
  'validation.password.mismatch': $localize`:@@validationErrors.passwordMismatch:The two password fields must match.`,
  'validation.finish.date.before.upload.date': $localize`:@@validationErrors.finishDateBeforeUploadDate:The finish date cannot be before the upload date.`,
  'validation.non.zero': $localize`:@@validationErrors.nonZero:Value can't be under zero.`,
  'validation.bringin.required': $localize`:@@validationErrors.bringinRequired:Bring-in date is required when finish date is set.`,
  'validation.finishTime.afterBringin': $localize`:@@validationErrors.finishTimeAfterBringin:Finish date must be after bring-in date.`,
  'validation.pickedUpTime.afterFinishTime': $localize`:@@validationErrors.pickedUpTimeAfterFinishTime:Pickup date must be after finish date.`,
  'validation.deadline.afterBringin': $localize`:@@validationErrors.deadlineAfterBringin:Deadline must be after upload date.`,
  'validation.pricemax.greaterThanPricemin': $localize`:@@validationErrors.pricemaxGreaterThanPricemin:Maximum price must be greater than minimum price.`,
  'validation.username.already.exists': $localize`:@@validationErrors.usernameAlreadyExists:Username already exists.`,
  'validation.job.beforeBringin': $localize`:@@validationErrors.jobBeforeBringin:Finish date cannot be before bring-in date.`,
  'validation.finishTime.requiredIfFinishTimeIsSet': $localize`:@@validationErrors.finishTimeRequiredIfFinishTimeIsSet:Finish time must be set if pickup time is set.`,
  'validation.finishTime.requiredIfFinalPriceIsSet': $localize`:@@validationErrors.finishTimeRequiredIfFinalPriceIsSet:Finish time must be set if final price is set.`,
  'validation.finishTime.requiredIfFinishNoteIsSet': $localize`:@@validationErrors.finishTimeRequiredIfFinishNoteIsSet:Finish time must be set if finish note is set.`,
  'validation.finishTime.requiredIfImagesAfterIsSet': $localize`:@@validationErrors.finishTimeRequiredIfImagesAfterIsSet:Finish time must be set if after images are uploaded.`,
  'validation.job.pickup.before.done': $localize`:@@validationErrors.jobPickupBeforeDone:Job cannot be picked up before it is done.`,
  'validation.job.pickedup.before.done': $localize`:@@validationErrors.jobPickedupBeforeDone:Some job was not finished at that time.`,
  'validation.job.pickedup.before.bringedin': $localize`:@@validationErrors.jobPickedupBeforeBringedin:Set pickup date cannot be before the upload date.`,
};

export default class ValidationErrorTranslator {
  static translateValidationErrorCode(errorCode: string): string {
    return validationErrorMessages[errorCode] || errorCode;
  }
}
