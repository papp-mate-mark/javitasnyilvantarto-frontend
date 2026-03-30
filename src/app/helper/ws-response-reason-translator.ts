export const wsReasonMessages: Record<string, string> = {
  'person.save': $localize`:@@wsReasons.personSave:Person data updated.`,
  'person.delete': $localize`:@@wsReasons.personDelete:Person deleted.`,
  'person.deleteById': $localize`:@@wsReasons.personDeleteById:Person deleted.`,

  'jobGroup.save': $localize`:@@wsReasons.jobGroupSave:Job group updated.`,
  'jobGroup.delete': $localize`:@@wsReasons.jobGroupDelete:Job group deleted.`,
  'jobGroup.deleteById': $localize`:@@wsReasons.jobGroupDeleteById:Job group deleted.`,

  'job.save': $localize`:@@wsReasons.jobSave:Job updated.`,
  'job.delete': $localize`:@@wsReasons.jobDelete:Job deleted.`,
  'job.deleteById': $localize`:@@wsReasons.jobDeleteById:Job deleted.`,

  'jobImage.save': $localize`:@@wsReasons.jobImageSave:Job image updated.`,
  'jobImage.delete': $localize`:@@wsReasons.jobImageDelete:Job image deleted.`,
  'jobImage.deleteById': $localize`:@@wsReasons.jobImageDeleteById:Job image deleted.`,
};

export const translateWsReason = (reason: string): string => {
  return wsReasonMessages[reason] || reason;
};
