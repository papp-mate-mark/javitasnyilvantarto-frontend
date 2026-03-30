import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { PersonSearchFilter } from '../../components/person-search-filter/person-search-filter';
import { PersonSearchTable } from '../../components/person-search-table/person-search-table';
import PersonSearchParams from '../../model/person-search-params';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Pageable from '../../model/pageable';
import { PersonService } from '../../service/person.service';
import { PersonStore } from '../../store/person.store';
import RowAction from '../../model/row-actions';
import { Router } from '@angular/router';
import { PageTitle } from '../../model/enums/PageTitle';
import PersonSearch from '../../model/person-search';

@Component({
  selector: 'app-person-search',
  imports: [PersonSearchFilter, PersonSearchTable],
  templateUrl: './person-search.html',
  styleUrl: './person-search.scss',
})
export class PersonSearchComponent implements OnInit {
  private readonly personService = inject(PersonService);
  private readonly personStore = inject(PersonStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  private readonly searchData = signal<PersonSearchParams>({} as PersonSearchParams);
  private readonly pageOptions = signal<Pageable>(new Pageable());

  ngOnInit(): void {
    this.fetchPerson();
  }

  filterChanged(newFilter: PersonSearchParams) {
    this.searchData.set(newFilter);
    this.fetchPerson();
  }

  fetchPerson() {
    this.personService
      .searchPerson(this.searchData(), this.pageOptions())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.personStore.setPersonSearch(value);
      });
  }

  pageOptionsChanged(event: Pageable) {
    this.pageOptions.set(event);
    this.fetchPerson();
  }

  protected readonly rowActions = [
    new RowAction<PersonSearch>(
      $localize`:@@personSearch.table.rowActions.select:Select`,
      (row: PersonSearch) => {
        this.router.navigate([PageTitle.PERSON_INFO, row.id]);
      }
    ),
  ];
}
