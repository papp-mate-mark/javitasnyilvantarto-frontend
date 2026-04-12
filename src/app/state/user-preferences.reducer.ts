import { createReducer, on } from '@ngrx/store';
import UserPreferences from '../model/user-preferences';
import { UserPreferencesActions } from './user-preferences.actions';

export const initialState: UserPreferences = new UserPreferences();

export const userPreferencesReducer = createReducer(
  initialState,
  on(UserPreferencesActions.setDarkMode, (state, { isDarkMode }) => ({
    ...state, //Future proofing, in case we add more preferences later
    isDarkMode,
  }))
);
