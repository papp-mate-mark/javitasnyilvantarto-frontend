import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import PageResponse from '../model/page-response';
import User from '../model/user';
import {
  initialValidationState,
  ValidationState,
  withValidationOperations,
} from '../service/form-validation';

interface UserState extends ValidationState {
  users: PageResponse<User>;
  usersLoading: boolean;
}

const initialState: UserState = {
  users: {} as PageResponse<User>,
  usersLoading: false,
  ...initialValidationState,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withValidationOperations(),
  withMethods((store) => ({
    setUsers(users: PageResponse<User>) {
      patchState(store, { users });
    },
    setUsersLoading(usersLoading: boolean) {
      patchState(store, { usersLoading });
    },
  }))
);
