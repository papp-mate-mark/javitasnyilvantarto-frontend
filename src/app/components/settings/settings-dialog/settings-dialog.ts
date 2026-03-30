import { Component, DestroyRef, inject, input, model, output } from '@angular/core';
import { SubmitDialog } from '../../submit-dialog/submit-dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { SettingsService } from '../../../service/settings.service';
import SystemSettings from '../../../model/system-settings';
import UpdateSettingRequest from '../../../model/update-setting-request';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SettingsStore } from '../../../store/settings.store';
import { fallbackExceptZero } from '../../../helper/fallback-except-zero.helper';
import { Textarea } from '../../textarea/textarea';

@Component({
  selector: 'app-settings-dialog',
  imports: [SubmitDialog, Textarea],
  templateUrl: './settings-dialog.html',
  styleUrl: './settings-dialog.scss',
})
export class SettingsDialog {
  /**
   * The system setting to be edited.
   */
  readonly settingToEdit = input.required<SystemSettings | undefined>();
  /**
   * Emitted when settings have been successfully updated.
   */
  readonly settingsUpdated = output<void>();
  /**
   * Two-way binding for dialog visibility state.
   */
  readonly dialogVisible = model.required<boolean>();
  private readonly destroyRef = inject(DestroyRef);
  protected readonly settingsStore = inject(SettingsStore);
  private readonly systemSettingService = inject(SettingsService);
  protected readonly parentGroup = new FormGroup({
    valueControl: new FormControl<string | undefined>(undefined),
  });

  save() {
    this.systemSettingService
      .updateSetting(
        this.settingToEdit()!.key,
        new UpdateSettingRequest(
          fallbackExceptZero(this.parentGroup.controls.valueControl.value, undefined),
        ),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.settingsUpdated.emit();
        this.dialogVisible.set(false);
      });
  }

  loadInititalValue() {
    this.parentGroup.controls.valueControl.setValue(this.settingToEdit()?.value);
  }
}
