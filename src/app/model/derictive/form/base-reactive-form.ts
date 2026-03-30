import {
  DestroyRef,
  Directive,
  effect,
  inject,
  Injector,
  input,
  InputSignal,
  OnInit,
  output,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { BaseForm } from './base-form';
import { FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isEqual } from 'lodash';
import { debounceTime } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Directive()
export abstract class BaseReactiveForm extends BaseForm implements OnInit {
  /**
   * The parent form group containing this control.
   */
  readonly parentGroup: InputSignal<FormGroup> = input.required();
  /**
   * Whether the form is currently loading data.
   */
  readonly isLoading: InputSignal<boolean> = input(false);
  /**
   * Emitted when the search term changes, with a 500ms debounce.
   */
  readonly searchChanged = output<any>();
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isFormInvalid = () =>
    this.parentGroup().invalid && (this.parentGroup().dirty || this.parentGroup().touched);

  private readonly previousValue = signal<any>(undefined);
  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      const control = this.parentGroup().get(this.controlName());
      control?.valueChanges
        .pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          if (!isEqual(this.previousValue(), value)) {
            this.previousValue.set(value);
            this.searchChanged.emit(value);
          }
        });
    });
  }

  getFormElement() {
    return this.parentGroup().get(this.controlName());
  }

  constructor() {
    super();

    effect(() => {
      const formElement = this.parentGroup().get(this.controlName());

      if (this.disabled()) {
        formElement?.disable({ emitEvent: false });
      } else {
        formElement?.enable({ emitEvent: false });
      }
    });
  }
}
