import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectorRef,
} from '@angular/core';
import { TextInput } from '../text-input/text-input';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { validationErrorValidator } from '../../service/form-validation';
import { Card } from 'primeng/card';
import { NumberInput } from '../number-input/number-input';
import NewJobFormData from '../../model/new-job-form-data';
import { PriceInput } from '../price-input/price-input';
import ImageWithId from '../../model/image-with-id';
import { AccordionModule } from 'primeng/accordion';
import { DatePicker } from '../date-picker/date-picker';
import { ButtonModule } from 'primeng/button';
import Column from '../../model/column';
import PersonSearch from '../../model/person-search';
import { PersonStore } from '../../store/person.store';
import { PersonService } from '../../service/person.service';
import PersonSearchParams from '../../model/person-search-params';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Pageable from '../../model/pageable';
import RowAction from '../../model/row-actions';
import { Dialog } from '../dialog/dialog';
import PersonUpload from '../../model/person-upload';
import JobGorupUpload from '../../model/job-group-upload';
import JobUpload from '../../model/jobupload';
import { AppMessageService } from '../../service/app-message.service';
import { updateAndMarkInvalidDirty } from '../../helper/form-validation.helper';
import { finalize } from 'rxjs';
import { fallbackExceptZero } from '../../helper/fallback-except-zero.helper';
import { AppConfirmationService } from '../../service/confirmation.service';
import { JobGroupService } from '../../service/job-group.service';
import { openBlobInNewTab } from '../../helper/open-blob-in-new-tab.helper';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerX } from '@ng-icons/tabler-icons';
import { PersonSearchTable } from '../person-search-table/person-search-table';
import { imagesNotFinishedValidator } from '../../helper/images-not-finished.validator';
import { serializeNullableDateToLocalOffsetString } from '../../helper/date-formatter';
import { Textarea } from '../textarea/textarea';
import { PictureUpload } from '../picture-upload/picture-upload';
import JobSearchParams from '../../model/job-search-params';
import { createChangeHandler } from '../../helper/changeHandler';
@Component({
  selector: 'app-new-job-form',
  imports: [
    TextInput,
    Card,
    NumberInput,
    PriceInput,
    AccordionModule,
    DatePicker,
    ButtonModule,
    Dialog,
    NgIcon,
    PersonSearchTable,
    Textarea,
    PictureUpload,
  ],
  providers: [provideIcons({ tablerX })],
  templateUrl: './new-job-form.html',
  styleUrl: './new-job-form.scss',
})
export class NewJobForm implements OnInit {
  // Track open/closed state for each job's accordion panel
  protected readonly extraDetailsOpen = signal<Record<number, boolean>>({});

  onAccordionPanelChange(index: number, open: boolean) {
    console.log('Panel changed:', index, open);
    const current = { ...this.extraDetailsOpen() };
    current[index] = open;
    this.extraDetailsOpen.set(current);
  }

  protected readonly personStore = inject(PersonStore);
  private readonly personService = inject(PersonService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(AppMessageService);
  private readonly jobGroupService = inject(JobGroupService);
  private readonly searchData = signal<PersonSearchParams>({} as PersonSearchParams);
  private readonly pageOptions = signal<Pageable>(new Pageable());
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly confirmationService = inject(AppConfirmationService);

  protected readonly personSelectorDialogVisible = signal(false);

  protected readonly selectPersonButtonLabel = computed(() => {
    if (this.personStore.personSearchLoading()) {
      return $localize`:@@newJobForm.personSearch.loading:Loading`;
    }

    const personSearch = this.personStore.personSearch();
    const count = personSearch.totalElements ?? 0;

    if (count === 0) {
      return $localize`:@@newJobForm.personSearch.empty:No person found`;
    }

    return $localize`:@@newJobForm.personSearch.select:Select person (${count})`;
  });

  ngOnInit(): void {
    this.createNewJobGroup();
    this.fetchPerson();
  }

  protected readonly personSelected = signal<number | undefined>(undefined);

  protected readonly customerParentGroup = new FormGroup({
    nameControl: new FormControl<string | undefined>(undefined, [
      Validators.required,
      validationErrorValidator(this.personStore.validationMessages, 'name'),
    ]),
    addressControl: new FormControl<string | undefined>(undefined, [
      Validators.required,
      validationErrorValidator(this.personStore.validationMessages, 'address'),
    ]),
    phoneControl: new FormControl<string | undefined>(undefined, [
      validationErrorValidator(this.personStore.validationMessages, 'phone'),
    ]),
    uploadDateControl: new FormControl<string | undefined>(undefined, [
      validationErrorValidator(this.personStore.validationMessages, 'bringin'),
    ]),
    deadLineControl: new FormControl<string | undefined>(undefined, [
      validationErrorValidator(this.personStore.validationMessages, 'deadline'),
    ]),
    jobs: new FormArray<FormGroup>([]),
  });

  protected readonly jobsParentGroup = signal<NewJobFormData[]>([]);
  createNewJobGroup() {
    const parentGroup = new FormGroup({
      objectControl: new FormControl<string | undefined>(undefined, [
        Validators.required,
        validationErrorValidator(this.personStore.validationMessages, 'objectname'),
      ]),
      descriptionControl: new FormControl<string | undefined>(undefined, [
        Validators.required,
        validationErrorValidator(this.personStore.validationMessages, 'description'),
      ]),
      materialControl: new FormControl<string | undefined>(undefined, [
        Validators.required,
        validationErrorValidator(this.personStore.validationMessages, 'material'),
      ]),
      weightControl: new FormControl<number | undefined>(undefined, [
        Validators.required,
        validationErrorValidator(this.personStore.validationMessages, 'weight'),
      ]),
      priceMinControl: new FormControl<number | undefined>(undefined, [
        Validators.required,
        validationErrorValidator(this.personStore.validationMessages, 'pricemin'),
      ]),
      priceMaxControl: new FormControl<number | undefined>(undefined, [
        validationErrorValidator(this.personStore.validationMessages, 'pricemax'),
      ]),
      uploadNoteControl: new FormControl<string | undefined>(undefined, [
        validationErrorValidator(this.personStore.validationMessages, 'uploadnote'),
      ]),
      finishNoteControl: new FormControl<string | undefined>(undefined, [
        validationErrorValidator(this.personStore.validationMessages, 'finishnote'),
      ]),
      pickupDateControl: new FormControl<string | undefined>(undefined, [
        validationErrorValidator(this.personStore.validationMessages, 'pickedUpTime'),
      ]),
      doneDateControl: new FormControl<string | undefined>(undefined, [
        validationErrorValidator(this.personStore.validationMessages, 'finishTime'),
      ]),
      finalPriceControl: new FormControl<number | undefined>(undefined, [
        validationErrorValidator(this.personStore.validationMessages, 'finalPrice'),
      ]),
      beforeImagesControl: new FormControl<ImageWithId[]>([], {
        nonNullable: true,
        validators: [imagesNotFinishedValidator()],
      }),
      afterImagesControl: new FormControl<ImageWithId[]>([], {
        nonNullable: true,
        validators: [imagesNotFinishedValidator()],
      }),
    });
    this.customerParentGroup.controls['jobs'].push(parentGroup);
  }

  addJob() {
    this.createNewJobGroup();
  }

  submitForm() {
    this.personStore.clearValidationErrors();
    this.updateControls();

    const hasNotFinishedImages = this.customerParentGroup.controls.jobs.controls.some(
      (job) =>
        job.controls['beforeImagesControl'].hasError('notFinished') ||
        job.controls['afterImagesControl'].hasError('notFinished'),
    );

    if (hasNotFinishedImages) {
      // Check for unuploaded images
      this.messageService.warning(
        $localize`:@@newJobForm.unuploadedImagesTitle:Unuploaded images`,
        $localize`:@@newJobForm.unuploadedImages:Please wait until all images are uploaded before submitting the form.`,
      );

      return;
    }

    if (this.customerParentGroup.valid) {
      const jobGroup = new JobGorupUpload(
        serializeNullableDateToLocalOffsetString(
          this.customerParentGroup.get('deadLineControl')?.value,
        ),
        this.customerParentGroup.controls['jobs'].controls.map(
          (job) =>
            new JobUpload(
              job.get('objectControl')?.value || undefined,
              job.get('descriptionControl')?.value || undefined,
              job.get('materialControl')?.value || undefined,
              fallbackExceptZero(job.get('priceMinControl')?.value, undefined),
              fallbackExceptZero(job.get('priceMaxControl')?.value, undefined),
              fallbackExceptZero(job.get('weightControl')?.value, undefined),
              serializeNullableDateToLocalOffsetString(job.get('doneDateControl')?.value),
              serializeNullableDateToLocalOffsetString(job.get('pickupDateControl')?.value),
              fallbackExceptZero(job.get('finalPriceControl')?.value, undefined),
              job.get('uploadNoteControl')?.value || undefined,
              job.get('finishNoteControl')?.value || undefined,
              job.get('beforeImagesControl')?.value.map((img: ImageWithId) => img.id!) || [],
              job.get('afterImagesControl')?.value.map((img: ImageWithId) => img.id!) || [],
            ),
        ),
        serializeNullableDateToLocalOffsetString(
          this.customerParentGroup.get('uploadDateControl')?.value || undefined,
        ),
      );
      const selectedPersonId = this.personSelected();
      (selectedPersonId
        ? this.personService.uploadJobGroupForPerson(selectedPersonId, jobGroup)
        : this.personService.uploadPersonAndJobGroup(
            new PersonUpload(
              this.customerParentGroup.get('nameControl')?.value || undefined,
              this.customerParentGroup.get('addressControl')?.value || undefined,
              this.customerParentGroup.get('phoneControl')?.value || undefined,
              jobGroup.deadline,
              jobGroup.jobs,
              jobGroup.bringin,
            ),
          )
      )
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => {
            updateAndMarkInvalidDirty(this.customerParentGroup, true);
          }),
        )
        .subscribe((value) => {
          this.clearForm();
          this.confirmationService.custom({
            message: $localize`:@@newJobForm.successMessage:Do you want to print the receipt?`,
            header: $localize`:@@newJobForm.successTitle:Successful upload`,
            acceptButtonProps: { label: $localize`:@@newJobForm.print:Print` },
            rejectButtonProps: {
              label: $localize`:@@newJobForm.close:Close`,
              outlined: true,
              severity: 'secondary',
            },
            accept: () => {
              this.jobGroupService
                .getReceipt(value.groupId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((blob) => {
                  openBlobInNewTab(blob);
                });
            },
          });
        });
    }
  }

  clearForm() {
    this.personSelected.set(undefined);
    this.customerParentGroup.reset();
    updateAndMarkInvalidDirty(this.customerParentGroup, true);
  }

  clearSelection() {
    this.personSelected.set(undefined);
    this.customerParentGroup.controls.nameControl.reset();
    this.customerParentGroup.controls.addressControl.reset();
    this.customerParentGroup.controls.phoneControl.reset();
  }

  
  handleChange = createChangeHandler<JobSearchParams>(this.searchData, () => {
    if(!this.personSelected()) this.fetchPerson();
    });

  fetchPerson() {
    this.personService
      .searchPerson(this.searchData(), this.pageOptions())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.personStore.setPersonSearch(value);
      });
  }

  personCols = [
    new Column('name', $localize`:@@newJobForm.personTable.name:Name`, true),
    new Column('address', $localize`:@@newJobForm.personTable.address:Address`, true),
    new Column('phone', $localize`:@@newJobForm.personTable.phone:Phone`, true),
  ];

  rowActions = [
    new RowAction($localize`:@@newJobForm.personTable.select:Select`, (row: PersonSearch) => {
      this.selectPerson(row);
    }),
  ];

  popupRowActions = [
    new RowAction($localize`:@@newJobForm.personTable.select:Select`, (row: PersonSearch) => {
      this.selectPerson(row);
      this.personSelectorDialogVisible.set(false);
    }),
  ];

  updateControls() {
    updateAndMarkInvalidDirty(this.customerParentGroup);

    this.cdr.detectChanges(); //TODO: Check if it's even needed
  }

  selectPerson(row: PersonSearch) {
    this.personSelected.set(row.id);
    this.customerParentGroup.controls['nameControl'].setValue(row.name);
    this.customerParentGroup.controls['addressControl'].setValue(row.address);
    this.customerParentGroup.controls['phoneControl'].setValue(row.phone);
  }

  pageOptionsChanged(event: Pageable) {
    this.pageOptions.set(event);
    this.fetchPerson();
  }

  clearJob(jobGroup: FormGroup) {
    this.customerParentGroup.controls['jobs'].removeAt(
      this.customerParentGroup.controls['jobs'].controls.indexOf(jobGroup),
    );
  }
}
