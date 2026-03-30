import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Provider } from '@angular/core';

export const testHttpClientProviders = [
  provideHttpClient(),
  provideHttpClientTesting(),
] as Provider[];
