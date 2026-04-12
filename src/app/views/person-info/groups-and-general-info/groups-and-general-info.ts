import { Component, computed, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PersonData } from '../../../components/person-data/person-data';
import { JobsTable } from '../../../person-info/jobs-table/jobs-table';
import { PersonStore } from '../../../store/person.store';
import { FullJobGroup } from '../../../model/full-job-group';
import { PersonService } from '../../../service/person.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppConfirmationService } from '../../../service/confirmation.service';
import { HasAuthorityDirective } from '../../../directive/has-authority.directive';
import { UserAuthorites } from '../../../model/user-autorities';

@Component({
  selector: 'app-groups-and-general-info',
  imports: [ButtonModule, PersonData, JobsTable, HasAuthorityDirective],
  templateUrl: './groups-and-general-info.html',
  styleUrl: './groups-and-general-info.scss',
})
export class GroupsAndGeneralInfo {
  private readonly router = inject(Router);
  private readonly personService = inject(PersonService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirmService = inject(AppConfirmationService);
  protected readonly personStore = inject(PersonStore);

  protected readonly jobGroups = computed(() => {
    const jobGroups = this.personStore.person()?.jobGroups;

    if (!jobGroups) {
      return [] as FullJobGroup[];
    }

    return jobGroups;
  });

  personDeletePressed() {
    this.confirmService.proceed(
      () => {
        this.personService
          .deletePerson(this.personStore.person().id!)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.router.navigate(['/']);
          });
      },
      undefined,
      $localize`:@@groupsAndGeneralInfo.deletePersonConfirm:Are you sure you want to delete this person? This action cannot be undone.`,
      $localize`:@@groupsAndGeneralInfo.deletePersonTitle:Person deletion`
    );
  }

  protected readonly requiredDeleteAuthority = UserAuthorites.MODIFY_JOBS;
}
