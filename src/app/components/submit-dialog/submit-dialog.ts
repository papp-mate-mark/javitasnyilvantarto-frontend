import { Component, input, InputSignal, model, ModelSignal, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-submit-dialog',
  imports: [DialogModule, ButtonModule],
  templateUrl: './submit-dialog.html',
  styleUrl: './submit-dialog.scss',
})
export class SubmitDialog {
  /**
   * Two-way binding for dialog visibility state.
   */
  readonly dialogVisible: ModelSignal<boolean> = model.required();
  /**
   * The width of the dialog.
   */
  readonly width: InputSignal<string | undefined> = input();
  /**
   * Emitted when the save button is clicked.
   */
  readonly savePressed = output();
  /**
   * Emitted when the cancel button is clicked.
   */
  readonly cancelPressed = output();
  /**
   * Emitted when the dialog is shown.
   */
  readonly shown = output();
  /**
   * Emitted when the dialog is hidden.
   */
  readonly hidden = output();
  /**
   * Whether the save button is disabled.
   */
  readonly saveDisabled: InputSignal<boolean> = input(false);
  /**
   * The title displayed in the dialog header.
   */
  readonly dialogTitle: InputSignal<string> = input.required();
  /**
   * The text displayed on the save button.
   */
  readonly saveText: InputSignal<string> = input($localize`:@@submitDialog.save:Save`);
  /**
   * The text displayed on the cancel button.
   */
  readonly cancelText: InputSignal<string> = input($localize`:@@submitDialog.cancel:Cancel`);
  cancel() {
    this.cancelPressed.emit();
    this.dialogVisible.set(false);
  }
}
