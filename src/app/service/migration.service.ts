import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import ErrorMessage from '../model/error-message';
import TransferRequest from '../model/transfer-request';

@Injectable({
  providedIn: 'root',
})
export class MigrationService {
  private readonly apiService = inject(ApiService);

  deleteDatabase() {
    return this.apiService.deleteReq<void>(
      `/migration`,
      new ErrorMessage(
        $localize`:@@migrationService.deleteDatabaseTitle:Delete Database`,
        $localize`:@@migrationService.deleteDatabaseFailed:Deleting database failed`,
      ),
    );
  }

  uploadMigrationFile(data: TransferRequest[]) {
    return this.apiService.postReq<void>(
      `/migration`,
      new ErrorMessage(
        $localize`:@@migrationService.uploadFailedTitle:Migration upload failed`,
        $localize`:@@migrationService.uploadFailed:Could not upload migration.`,
      ),
      data,
    );
  }

  downloadDatabase() {
    return this.apiService.getReq<TransferRequest>(
      `/migration`,
      new ErrorMessage(
        $localize`:@@migrationService.downloadFailedTitle:Migration download failed`,
        $localize`:@@migrationService.downloadFailed:Could not download migration.`,
      ),
    );
  }
}
