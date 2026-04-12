import { Component, input, InputSignal, model, ModelSignal, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-dialog',
  imports: [DialogModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  /**
   * Two-way binding for dialog visibility state.
   */
  readonly dialogVisible: ModelSignal<boolean> = model.required();
  /**
   * The dialog title to display.
   */
  readonly dialogTitle: InputSignal<string> = input.required();
  /**
   * Emitted when the dialog is shown.
   */
  readonly shown = output();
  /**
   * Emitted when the dialog is hidden.
   */
  readonly hidden = output();
}
