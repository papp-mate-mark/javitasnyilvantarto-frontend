import { Component, output, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TextInput } from '../../text-input/text-input';
import { FormControl, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import SystemSettingsFilterParams from '../../../model/system-settings-filter-params';
import { createChangeHandler } from '../../../helper/changeHandler';

@Component({
  selector: 'app-settings-filter',
  imports: [CardModule, TextInput, ButtonModule],
  templateUrl: './settings-filter.html',
  styleUrl: './settings-filter.scss',
})
export class SettingsFilter {
  /**
   * Emitted when the search term changes.
   */
  readonly searchChanged = output<SystemSettingsFilterParams>();
  private readonly filterValue = signal<SystemSettingsFilterParams>(
    {} as SystemSettingsFilterParams,
  );

  protected readonly parentGroup = new FormGroup({
    keySearchControl: new FormControl<string | undefined>(undefined),
  });

  handleChange = createChangeHandler<SystemSettingsFilterParams>(this.filterValue, () => {
    this.searchChanged.emit(this.filterValue());
  });
}
