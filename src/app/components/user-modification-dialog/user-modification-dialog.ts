import { Component, computed, DestroyRef, inject, input, model, output } from '@angular/core';
import User from '../../model/user';
import { SubmitDialog } from '../submit-dialog/submit-dialog';
import { TextInput } from '../text-input/text-input';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { validationErrorValidator } from '../../service/form-validation';
import { UserStore } from '../../store/user.store';
import { Multiselect } from '../multiselect/multiselect';
import { userAuthorityDropdownValue, UserAuthorites } from '../../model/user-autorities';
import { UserService } from '../../service/user.service';
import UserRegisterRequest from '../../model/user-register-request';
import { updateAndMarkInvalidDirty } from '../../helper/form-validation.helper';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-modification-dialog',
  imports: [SubmitDialog, TextInput, Multiselect],
  templateUrl: './user-modification-dialog.html',
  styleUrl: './user-modification-dialog.scss',
})
export class UserModificationDialog {
  /**
   * Two-way binding for dialog visibility state.
   */
  readonly dialogVisible = model.required<boolean>();
  /**
   * The user to modify, or undefined to create a new user.
   */
  readonly userToModify = input.required<User | undefined>();
  /**
   * Emitted when a user is successfully saved.
   */
  readonly userSaved = output();
  /**
   * Emitted when a new password is generated for a created user.
   */
  readonly passwordGenerated = output<string>();
  private readonly userStore = inject(UserStore);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly parentGroup = new FormGroup({
    usernameControl: new FormControl<string | undefined>(undefined, [
      Validators.required,
      validationErrorValidator(this.userStore.validationMessages, 'username'),
    ]),
    nameControl: new FormControl<string | undefined>(undefined, [
      validationErrorValidator(this.userStore.validationMessages, 'name'),
    ]),
    authoritiesControl: new FormControl<UserAuthorites[] | undefined>(undefined),
  });

  protected readonly dialogTitle = computed(() =>
    this.userToModify()
      ? $localize`:@@userModificationDialog.editUserTitle:Edit User`
      : $localize`:@@userModificationDialog.createUserTitle:Create New User`,
  );

  protected readonly availableAuthorities = userAuthorityDropdownValue();

  protected onDialogShown() {
    const user = this.userToModify();

    if (user) {
      this.parentGroup.reset(
        {
          usernameControl: user.username,
          authoritiesControl: user.authorities ?? [],
          nameControl: user.name ?? undefined,
        },
        { emitEvent: false },
      );
    }
  }

  onDialogHidden() {
    this.parentGroup.reset();
  }

  submit() {
    this.userStore.clearValidationErrors();
    updateAndMarkInvalidDirty(this.parentGroup);

    if (this.parentGroup.valid) {
      const user = this.userToModify();
      const request: UserRegisterRequest = new UserRegisterRequest(
        this.parentGroup.controls.usernameControl.value!,
        this.parentGroup.controls.nameControl.value!,
        this.parentGroup.controls.authoritiesControl.value ?? [],
      );

      if (user) {
        this.userService
          .updateUser(user.id, request)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => updateAndMarkInvalidDirty(this.parentGroup, true)),
          )
          .subscribe(() => {
            this.dialogVisible.set(false);
            this.userSaved.emit();
          });
      } else {
        this.userService
          .registerUser(request)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => updateAndMarkInvalidDirty(this.parentGroup, true)),
          )
          .subscribe((value) => {
            this.dialogVisible.set(false);
            this.passwordGenerated.emit(value.newPassword);
            this.userSaved.emit();
          });
      }
    }
  }
}
