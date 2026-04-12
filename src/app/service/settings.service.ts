import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import ErrorMessage from '../model/error-message';
import { finalize } from 'rxjs';
import Pageable, { toPageableParams } from '../model/pageable';
import PageResponse from '../model/page-response';
import { toHttpParams } from '../helper/to-http-params';
import { SettingsStore } from '../store/settings.store';
import SystemSettings from '../model/system-settings';
import UpdateSettingRequest from '../model/update-setting-request';
import SystemSettingsFilterParams from '../model/system-settings-filter-params';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly apiService = inject(ApiService);
  private readonly settingsStore = inject(SettingsStore);

  searchSettings(params: SystemSettingsFilterParams, pageable: Pageable) {
    this.settingsStore.setSettingsLoading(true);

    return this.apiService
      .getReq<PageResponse<SystemSettings>>(
        `/admin/system-settings/search`,
        new ErrorMessage(
          $localize`:@@settingsService.searchTitle:Settings search`,
          $localize`:@@settingsService.searchFailed:Searching settings failed`,
        ),

        toHttpParams({ ...toPageableParams(pageable), ...params }),
      )
      .pipe(
        finalize(() => {
          this.settingsStore.setSettingsLoading(false);
        }),
      );
  }

  updateSetting(settingKey: string, value: UpdateSettingRequest) {
    this.settingsStore.setSettingsLoading(true);

    return this.apiService
      .patchReq<void>(
        `/admin/system-settings/${settingKey}`,
        new ErrorMessage(
          $localize`:@@settingsService.updateTitle:Update Setting`,
          $localize`:@@settingsService.updateFailed:Updating setting failed`,
        ),
        value,
      )
      .pipe(
        finalize(() => {
          this.settingsStore.setSettingsLoading(false);
        }),
      );
  }
}
