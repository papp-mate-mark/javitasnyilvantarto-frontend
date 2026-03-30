import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { FullPersonData } from '../model/full-person-data';
import PageResponse from '../model/page-response';
import PersonSearch from '../model/person-search';
import {
  initialValidationState,
  ValidationState,
  withValidationOperations,
} from '../service/form-validation';

interface PersonState extends ValidationState {
  person: FullPersonData;
  personLoading: boolean;
  personSearch: PageResponse<PersonSearch>;
  personSearchLoading: boolean;
  personUploadLoading: boolean;
}

const initialState: PersonState = {
  person: {} as FullPersonData,
  personLoading: false,
  personSearch: {} as PageResponse<PersonSearch>,
  personSearchLoading: false,
  personUploadLoading: false,
  ...initialValidationState,
};
export const PersonStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withValidationOperations(),
  withMethods((store) => ({
    setPerson(person: FullPersonData) {
      patchState(store, { person });
    },
    setPersonLoading(personLoading: boolean) {
      patchState(store, { personLoading });
    },
    setPersonSearch(personSearch: PageResponse<PersonSearch>) {
      patchState(store, { personSearch });
    },
    setPersonSearchLoading(personSearchLoading: boolean) {
      patchState(store, { personSearchLoading });
    },
    setPersonUploadLoading(personUploadLoading: boolean) {
      patchState(store, { personUploadLoading });
    },
  }))
);
