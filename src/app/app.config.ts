import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeuix/themes/aura';

import { localStorageSync } from 'ngrx-store-localstorage';
import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Action, ActionReducer, MetaReducer, provideStore } from '@ngrx/store';
import { currentUserReducer } from './state/current-user.reducer';
import CurrentUser from './model/current-user';
import { DatePipe } from '@angular/common';
import { requestInterceptor } from './interceptor/reqest-interceptor-interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { userPreferencesReducer } from './state/user-preferences.reducer';
import UserPreferences from './model/user-preferences';

export function localStorageSyncReducer(
  reducer: ActionReducer<{ currentUser: CurrentUser; userPreferences: UserPreferences }>,
): ActionReducer<{ currentUser: CurrentUser; userPreferences: UserPreferences }> {
  return localStorageSync({ keys: ['currentUser', 'userPreferences'], rehydrate: true })(reducer);
}

const metaReducers: MetaReducer<{ currentUser: CurrentUser; userPreferences: UserPreferences }, Action>[] = [localStorageSyncReducer];

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    DatePipe,
    ConfirmationService,
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([requestInterceptor])),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
    provideStore({ currentUser: currentUserReducer, userPreferences: userPreferencesReducer }, { metaReducers }),
  ],
};
