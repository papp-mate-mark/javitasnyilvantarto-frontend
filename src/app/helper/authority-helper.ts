import { Store } from '@ngrx/store';
import { UserAuthorites } from '../model/user-autorities';
import { hasAuthority } from '../state/current-user.selector';

export const checkAuthority = (store: Store, authority: UserAuthorites): boolean => {
  return store.selectSignal(hasAuthority(authority))();
};
