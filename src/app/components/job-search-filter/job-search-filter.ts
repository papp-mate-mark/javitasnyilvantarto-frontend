import { Component, output, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import JobSearchParams from '../../model/job-search-params';
import { DateRangePicker } from '../date-range-picker/date-range-picker';
import { NumberInput } from '../number-input/number-input';
import { TextInput } from '../text-input/text-input';
import { CheckboxInput } from "../checkbox-input/checkbox-input";
import { createChangeHandler } from '../../helper/changeHandler';

@Component({
  selector: 'app-job-search-filter',
  imports: [CardModule, AccordionModule, DateRangePicker, TextInput, NumberInput, CheckboxInput],
  templateUrl: './job-search-filter.html',
  styleUrl: './job-search-filter.scss',
})
export class JobSearchFilter {
  /**
   * Emitted when the search filter parameters change.
   */
  readonly filterChanged = output<JobSearchParams>();
  readonly filterValue = signal<JobSearchParams>({} as JobSearchParams);
  protected readonly parentGroup = new FormGroup({
    nameSearchControl: new FormControl<string | undefined>(undefined),
    descriptionSearchControl: new FormControl<string | undefined>(undefined),
    objectSearchControl: new FormControl<string | undefined>(undefined),
    uploadDateRangeControl: new FormControl<(Date | null)[] | undefined>(undefined),
    addressControl: new FormControl<string | undefined>(undefined),
    phoneControl: new FormControl<string | undefined>(undefined),
    materialControl: new FormControl<string | undefined>(undefined),
    uploadNoteControl: new FormControl<string | undefined>(undefined),
    doneNoteControl: new FormControl<string | undefined>(undefined),
    finalPriceMinControl: new FormControl<number | null>(null),
    finalPriceMaxControl: new FormControl<number | null>(null),
    weightMinControl: new FormControl<number | null>(null),
    weightMaxControl: new FormControl<number | null>(null),
    onlyWithPhotosControl: new FormControl<boolean>(false),
  });

  handleChange = createChangeHandler<JobSearchParams>(this.filterValue, () => {
    this.filterChanged.emit(this.filterValue());
  });

  handleDateRangeChange(
    value: (Date | null)[] | undefined,
    startKey: keyof JobSearchParams,
    endKey: keyof JobSearchParams,
  ) {
    if (!value || value.length !== 2) {
      this.filterValue.set({
        ...this.filterValue(),
        [startKey]: undefined,
        [endKey]: undefined,
      } as JobSearchParams);
    } else {
      this.filterValue.set({
        ...this.filterValue(),
        [startKey]: value[0] || undefined,
        [endKey]: value[1] || undefined,
      } as JobSearchParams);
    }

    this.filterChanged.emit(this.filterValue());
  }
}
