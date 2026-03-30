import { Component, input, model } from '@angular/core';
import { Dialog } from '../dialog/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { PasswordInput } from '../password-input/password-input';

@Component({
  selector: 'app-new-password-dialog',
  imports: [Dialog, PasswordInput],
  templateUrl: './new-password-dialog.html',
  styleUrl: './new-password-dialog.scss',
})
export class NewPasswordDialog {
  /**
   * Two-way binding for dialog visibility state.
   */
  readonly dialogVisible = model.required<boolean>();
  /**
   * The generated password to display.
   */
  readonly password = input.required<string>();
  readonly parentGroup = new FormGroup({
    newPasswordControl: new FormControl<string | undefined>(undefined),
  });

  setPassword() {
    this.parentGroup.controls.newPasswordControl.setValue(this.password());
  }
}
