export enum JobStatus {
  IN_PROGRESS,
  READY_FOR_PICKUP,
  PICKED_UP,
}

export const translateJobStatus = (status: JobStatus) => {
  switch (status) {
    case JobStatus.IN_PROGRESS:
      return $localize`:@@jobStatus.inProgress:In progress`;
    case JobStatus.READY_FOR_PICKUP:
      return $localize`:@@jobStatus.readyForPickup:Ready for pickup`;
    case JobStatus.PICKED_UP:
      return $localize`:@@jobStatus.pickedUp:Picked up`;
  }
};
