import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import PageResponse from '../model/page-response';
import SystemSettings from '../model/system-settings';

interface SettingsState {
  settings: PageResponse<SystemSettings>;
  settingsLoading: boolean;
}

const initialState: SettingsState = {
  settings: {} as PageResponse<SystemSettings>,
  settingsLoading: false,
};
export const SettingsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setSettings(settings: PageResponse<SystemSettings>) {
      patchState(store, { settings });
    },
    setSettingsLoading(settingsLoading: boolean) {
      patchState(store, { settingsLoading });
    },
  }))
);
