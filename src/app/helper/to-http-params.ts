import { HttpParams } from '@angular/common/http';
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Converts an object into HttpParams
 * Handles arrays and nested objects.
 */
export function toHttpParams(obj: any): HttpParams {
  let params = new HttpParams();

  const buildParams = (key: string, value: any) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        // append each array item individually
        params = params.append(key, v.toString());
      });
    }
    else if (typeof value !== 'object') {
      params = params.set(key, value.toString());
    }
  };

  Object.keys(obj).forEach((key) => {
    buildParams(key, obj[key]);
  });

  return params;
}
