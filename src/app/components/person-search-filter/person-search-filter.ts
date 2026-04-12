import { Component, output, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FormControl, FormGroup } from '@angular/forms';
import PersonSearchParams from '../../model/person-search-params';
import { fallbackExceptZero } from '../../helper/fallback-except-zero.helper';
import { TextInput } from '../text-input/text-input';

@Component({
  selector: 'app-person-search-filter',
  imports: [CardModule, TextInput],
  templateUrl: './person-search-filter.html',
  styleUrl: './person-search-filter.scss',
})
export class PersonSearchFilter {
  /**
   * Emitted when the search filter parameters change.
   */
  readonly filterChanged = output<PersonSearchParams>();
  readonly previousFilter = signal<PersonSearchParams>(new PersonSearchParams());

  protected readonly parentGroup = new FormGroup({
    nameSearchControl: new FormControl<string | undefined>(undefined),
    addressSearchControl: new FormControl<string | undefined>(undefined),
    phoneSearchControl: new FormControl<string | undefined>(undefined),
  });

  nameChanged(newTerm: string) {
    this.previousFilter.set({
      ...this.previousFilter(),
      name: fallbackExceptZero(newTerm, undefined),
    } as PersonSearchParams);
    this.emitFilterChange();
  }

  addressChanged(newTerm: string) {
    this.previousFilter.set({
      ...this.previousFilter(),
      address: fallbackExceptZero(newTerm, undefined),
    } as PersonSearchParams);
    this.emitFilterChange();
  }

  phoneChanged(newTerm: string) {
    this.previousFilter.set({
      ...this.previousFilter(),
      phone: fallbackExceptZero(newTerm, undefined),
    } as PersonSearchParams);
    this.emitFilterChange();
  }

  emitFilterChange() {
    this.filterChanged.emit(this.previousFilter());
  }
}
