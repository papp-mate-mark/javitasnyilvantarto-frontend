import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import ErrorMessage from '../model/error-message';
import PersonSearchParams from '../model/person-search-params';
import Pageable, { toPageableParams } from '../model/pageable';
import PersonSearch from '../model/person-search';
import { toHttpParams } from '../helper/to-http-params';
import PageResponse from '../model/page-response';
import PersonUpload from '../model/person-upload';
import JobGroupUploadResponse from '../model/job-group-upload-response';
import JobGorupUpload from '../model/job-group-upload';
import { PersonStore } from '../store/person.store';
import { finalize } from 'rxjs';
import { validateOnServerError } from './form-validation';
import { FullPersonData } from '../model/full-person-data';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private readonly apiService = inject(ApiService);
  private readonly personStore = inject(PersonStore);

  fetchPersonAndJobs(personId: number) {
    return this.apiService.getReq<FullPersonData>(
      `/person/${personId}`,
      new ErrorMessage(
        $localize`:@@personService.fetchPersonAndJobsTitle:Fetch Person and Jobs`,
        $localize`:@@personService.fetchPersonAndJobsFailed:Fetching person and jobs failed`,
      ),
    );
  }

  searchPerson(searchParams: PersonSearchParams, pageOptions: Pageable) {
    this.personStore.setPersonSearchLoading(true);

    return this.apiService
      .getReq<
        PageResponse<PersonSearch>
      >(`/person/search`, new ErrorMessage($localize`:@@personService.searchPersonTitle:Search Person`, $localize`:@@personService.searchPersonFailed:Searching person failed`), toHttpParams({ ...searchParams, ...toPageableParams(pageOptions) }))
      .pipe(finalize(() => this.personStore.setPersonSearchLoading(false)));
  }

  uploadPersonAndJobGroup(data: PersonUpload) {
    this.personStore.setPersonUploadLoading(true);

    return this.apiService
      .postReq<JobGroupUploadResponse>(
        `/person`,
        new ErrorMessage(
          $localize`:@@personService.uploadPersonAndJobGroupTitle:Upload Person and Job Group`,
          $localize`:@@personService.uploadPersonAndJobGroupFailed:Uploading person and job group failed`,
        ),
        data,
      )
      .pipe(
        finalize(() => {
          this.personStore.setPersonUploadLoading(false);
        }),
        validateOnServerError(this.personStore),
      );
  }

  uploadJobGroupForPerson(personId: number, data: JobGorupUpload) {
    this.personStore.setPersonUploadLoading(true);

    return this.apiService
      .postReq<JobGroupUploadResponse>(
        `/person/${personId}/job-groups`,
        new ErrorMessage(
          $localize`:@@personService.uploadJobGroupTitle:Uploading job group`,
          $localize`:@@personService.uploadJobGroupFailed:Uploading job group failed`,
        ),
        data,
      )
      .pipe(
        finalize(() => {
          this.personStore.setPersonUploadLoading(false);
        }),
        validateOnServerError(this.personStore),
      );
  }

  deletePerson(personId: number) {
    return this.apiService.deleteReq<void>(
      `/person/${personId}`,
      new ErrorMessage(
        $localize`:@@personService.deletePersonTitle:Delete Person`,
        $localize`:@@personService.deletePersonFailed:Deleting person failed`,
      ),
    );
  }
}
