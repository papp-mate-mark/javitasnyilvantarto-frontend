import { createActionGroup, emptyProps, props } from '@ngrx/store';
import LoginResponse from '../model/login-response';

export const CurrentUserApiActions = createActionGroup({
  source: 'Current User API',
  events: {
    'Retrieved Current User': props<{ loginResponse: LoginResponse }>(),
    'Unset Current User': emptyProps(),
  },
});
