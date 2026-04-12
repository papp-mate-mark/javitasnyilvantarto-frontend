import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import ErrorMessage from '../model/error-message';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppMessageService } from './app-message.service';
import { ErrorTypes } from '../model/enums/error-types';
import { ErrorResponse } from '../model/error-response';
import MethodViolationErrorResponse from '../model/method-violation-error-response';
import ErrorCodeTranslator from '../helper/error-code-translator';
import { translateMethodViolationMessages } from '../helper/constraint-violation-translator';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly httpClient = inject(HttpClient);
  private httpHeader = new HttpHeaders();
  private readonly store = inject(Store);
  private readonly appMessageService = inject(AppMessageService);
  private readonly router = inject(Router);
  private readonly BASE_URL = environment.API_URL;

  setHeader(name: string, value: string) {
    this.httpHeader = this.httpHeader.set(name, value);
  }

  clearHeader(name: string) {
    this.httpHeader = this.httpHeader.delete(name);
  }

  private handleRequest<T>(
    observable: Observable<T>,
    endpoint: string,
    fallback: ErrorMessage,
  ): Observable<T> {
    return observable.pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, endpoint, fallback);
        throw error;
      }),
    );
  }

  getReq<T>(
    endpoint: string,
    errorMessage: ErrorMessage,
    params?: HttpParams,
    headers?: HttpHeaders,
  ): Observable<T> {
    const combinedHeaders = this.makeCombinedHeaders(headers);

    return this.handleRequest(
      this.httpClient.get<T>(this.BASE_URL + endpoint, { headers: combinedHeaders, params }),
      endpoint,
      errorMessage,
    );
  }

  getBlob(
    endpoint: string,
    errorMessage: ErrorMessage,
    params?: HttpParams,
    headers?: HttpHeaders,
  ): Observable<Blob> {
    const combinedHeaders = this.makeCombinedHeaders(headers);

    return this.handleRequest(
      this.httpClient.get(this.BASE_URL + endpoint, {
        headers: combinedHeaders,
        params,
        responseType: 'blob',
      }),
      endpoint,
      errorMessage,
    );
  }

  postReq<T>(
    endpoint: string,
    errorMessage: ErrorMessage,
    body?: any,
    params?: HttpParams,
    headers?: HttpHeaders,
  ): Observable<T> {
    const combinedHeaders = this.makeCombinedHeaders(headers);

    return this.handleRequest(
      this.httpClient.post<T>(this.BASE_URL + endpoint, body, { headers: combinedHeaders, params }),
      endpoint,
      errorMessage,
    );
  }

  putReq<T>(
    endpoint: string,
    errorMessage: ErrorMessage,
    body: any,
    params?: HttpParams,
    headers?: HttpHeaders,
  ): Observable<T> {
    const combinedHeaders = this.makeCombinedHeaders(headers);

    return this.handleRequest(
      this.httpClient.put<T>(this.BASE_URL + endpoint, body, { headers: combinedHeaders, params }),
      endpoint,
      errorMessage,
    );
  }

  patchReq<T>(
    endpoint: string,
    errorMessage: ErrorMessage,
    body: any,
    params?: HttpParams,
    headers?: HttpHeaders,
  ): Observable<T> {
    const combinedHeaders = this.makeCombinedHeaders(headers);

    return this.handleRequest(
      this.httpClient.patch<T>(this.BASE_URL + endpoint, body, {
        headers: combinedHeaders,
        params,
      }),
      endpoint,
      errorMessage,
    );
  }

  deleteReq<T>(
    endpoint: string,
    errorMessage: ErrorMessage,
    params?: HttpParams,
    headers?: HttpHeaders,
  ): Observable<T> {
    const combinedHeaders = this.makeCombinedHeaders(headers);

    return this.handleRequest(
      this.httpClient.delete<T>(this.BASE_URL + endpoint, { headers: combinedHeaders, params }),
      endpoint,
      errorMessage,
    );
  }

  handleError(error: HttpErrorResponse, endpoint: string, fallbackMessage: ErrorMessage) {
    if (error.error instanceof Blob && error.error.type.includes('json')) {
      error.error
        .text()
        .then((jsonText) => {
          const blobError = JSON.parse(jsonText) as ErrorResponse;

          if (!this.handleBackendErrorResponse(blobError, fallbackMessage)) {
            this.appMessageService.error(fallbackMessage.title, fallbackMessage.message);
          }
        })
        .catch(() => {
          this.appMessageService.error(fallbackMessage.title, fallbackMessage.message);
        });

      return;
    }

    if (this.handleBackendErrorResponse(error.error as ErrorResponse, fallbackMessage)) {
      return;
    }

    this.appMessageService.error(fallbackMessage.title, fallbackMessage.message);
  }

  private handleBackendErrorResponse(
    errorResponse: ErrorResponse | undefined,
    fallbackMessage: ErrorMessage,
  ): boolean {
    if (!errorResponse?.errorType) {
      return false;
    }

    switch (errorResponse.errorType) {
      case ErrorTypes.GENERAL_ERROR:
      case ErrorTypes.VALIDATION_ERROR:
        this.appMessageService.error(
          fallbackMessage.title,
          ErrorCodeTranslator.translateErrorCode(errorResponse.errorKey),
        );

        return true;
      case ErrorTypes.CONSTRAINT_VIOLATION_ERROR:
        this.appMessageService.error(
          ErrorCodeTranslator.translateErrorCode(errorResponse.errorKey),
          (errorResponse as MethodViolationErrorResponse).violationDetails
            .map((detail) => translateMethodViolationMessages(detail))
            .join('\n'),
        );

        return true;
      default:
        return false;
    }
  }

  private makeCombinedHeaders(extraHeader?: HttpHeaders): HttpHeaders {
    let combinedHeaders = this.httpHeader;

    if (extraHeader) {
      extraHeader.keys().forEach((key) => {
        const value = extraHeader.get(key);
        if (value) combinedHeaders = combinedHeaders.set(key, value);
      });
    }

    return combinedHeaders;
  }
}
