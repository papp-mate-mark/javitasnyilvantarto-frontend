import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import RefreshTokenData from '../model/refresh-token-data';

interface RefreshTokenState {
  activeTokens: RefreshTokenData[];
  activeTokensLoading: boolean;
}

const initialState: RefreshTokenState = {
  activeTokens: [],
  activeTokensLoading: false,
};

export const RefreshTokenStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setActiveTokens(activeTokens: RefreshTokenData[]) {
      patchState(store, { activeTokens });
    },
    setActiveTokensLoading(activeTokensLoading: boolean) {
      patchState(store, { activeTokensLoading });
    },
  })),
);