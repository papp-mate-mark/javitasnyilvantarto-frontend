import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, model, output } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { finalize } from 'rxjs';
import { updateAndMarkInvalidDirty } from '../../helper/form-validation.helper';
import { AppMessageService } from '../../service/app-message.service';
import { validationErrorValidator } from '../../service/form-validation';
import { UserService } from '../../service/user.service';
import { UserStore } from '../../store/user.store';
import { PasswordInput } from '../password-input/password-input';
import { SubmitDialog } from '../submit-dialog/submit-dialog';

@Component({
  selector: 'app-new-password-dialog',
  imports: [SubmitDialog, PasswordInput],
  templateUrl: './new-password-dialog.html',
  styleUrl: './new-password-dialog.scss',
})
export class NewPasswordDialog {
  /**
   * Two-way binding for dialog visibility state.
   */
  readonly dialogVisible = model.required<boolean>();
  /**
   * Emitted after the password is successfully changed.
   */
  readonly passwordChanged = output<void>();

  private readonly userService = inject(UserService);
  private readonly userStore = inject(UserStore);
  private readonly messageService = inject(AppMessageService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly parentGroup = new FormGroup({
    newPasswordControl: new FormControl<string | undefined>(undefined, [
      Validators.required,
      validationErrorValidator(this.userStore.validationMessages, 'newPassword'),
    ]),
    newPasswordAgainControl: new FormControl<string | undefined>(undefined, [
      Validators.required,
      this.passwordMatchValidator(),
    ]),
  });

  protected readonly dialogTitle = $localize`:@@newPasswordDialog.changeOwnTitle:Change password`;
  protected readonly saveButtonText = $localize`:@@newPasswordDialog.save:Change password`;

  constructor() {
    this.parentGroup.controls.newPasswordControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.parentGroup.controls.newPasswordAgainControl.updateValueAndValidity({
          emitEvent: true,
        });
      });
  }

  protected onDialogHidden() {
    this.parentGroup.reset();
    this.userStore.clearValidationErrors();
  }

  protected submit() {
    this.userStore.clearValidationErrors();
    updateAndMarkInvalidDirty(this.parentGroup);

    if (this.parentGroup.valid) {
      this.userService
        .resetOwnPassword(this.parentGroup.controls.newPasswordControl.value!)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => updateAndMarkInvalidDirty(this.parentGroup, true)),
        )
        .subscribe(() => {
          this.dialogVisible.set(false);
          this.messageService.success(
            $localize`:@@newPasswordDialog.successTitle:Password changed`,
            $localize`:@@newPasswordDialog.successMessage:Your password has been changed successfully.`,
          );
          this.passwordChanged.emit();
        });
    }
  }

  private passwordMatchValidator(): ValidatorFn {
    return (control) => {
      const originalPassword = this.parentGroup?.controls.newPasswordControl.value;

      if (!control.value || !originalPassword || control.value === originalPassword) {
        return null;
      }

      return { validationMessages: ['validation.password.mismatch'] };
    };
  }
}
