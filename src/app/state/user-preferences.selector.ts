import { createFeatureSelector, createSelector } from '@ngrx/store';
import UserPreferences from '../model/user-preferences';

export const selectUserPreferences = createFeatureSelector<UserPreferences>('userPreferences');

export const selectIsDarkMode = createSelector(
  selectUserPreferences,
  (preferences: UserPreferences) => preferences.isDarkMode
);
