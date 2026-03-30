import { createActionGroup, props } from '@ngrx/store';

export const UserPreferencesActions = createActionGroup({
  source: 'User Preferences',
  events: {
    'Set Dark Mode': props<{ isDarkMode: boolean }>(),
  },
});
