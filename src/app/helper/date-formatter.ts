import { DatePipe } from '@angular/common';
import { Injectable, LOCALE_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateFormatter {
  private readonly datePipe = new DatePipe(inject(LOCALE_ID));
  private readonly dateFormat = 'yyyy. MM. dd. HH:mm';

  formatDate(date: Date): string {
    return this.datePipe.transform(date, this.dateFormat) || '-';
  }
}

export function serializeNullableDateToLocalOffsetString(
  date: Date | string | undefined | null,
): string | undefined {
  if (!date) {
    return undefined;
  }

  return serializeDateToLocalOffsetString(date);
}

export function serializeDateToLocalOffsetString(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const pad = (value: number, length = 2) => value.toString().padStart(length, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}
