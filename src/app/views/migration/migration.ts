import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { MigrationService } from '../../service/migration.service';
import { AppConfirmationService } from '../../service/confirmation.service';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AppMessageService } from '../../service/app-message.service';
import { downloadJson } from '../../helper/download-json.helper';
import TransferRequest, { TransferRequestSchema } from '../../model/transfer-request';
import { z } from 'zod';

@Component({
  selector: 'app-migration',
  imports: [FileUploadModule, CardModule, ButtonModule],
  templateUrl: './migration.html',
  styleUrl: './migration.scss',
})
export class Migration {
  private readonly migrationService = inject(MigrationService);
  private readonly confirmationService = inject(AppConfirmationService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly selectedData = signal<TransferRequest[] | undefined>(undefined);
  protected readonly uploading = signal(false);
  private readonly appMessageService = inject(AppMessageService);

  protected readonly disableButtons = computed(
    () => this.uploading() || this.selectedData() === undefined,
  );

  deleteDatabase() {
    this.confirmationService.proceed(
      () => {
        this.appMessageService.info(
          $localize`:@@migrations.toastTitle:Migration`,
          $localize`:@@migrations.deleteStart:Database deletion started.`,
        );

        this.uploading.set(true);

        this.migrationService
          .deleteDatabase()
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => this.uploading.set(false)),
          )
          .subscribe(() => {
            this.appMessageService.success(
              $localize`:@@migrations.toastTitle:Migration`,

              $localize`:@@migrations.deleteSuccess:Database deleted.`,
            );
          });
      },
      undefined,
      $localize`:@@migration.confirmDeleteDatabase:Are you sure you want to delete the database?`,
    );
  }

  uploadMigrationFile(event: FileUploadHandlerEvent) {
    const file = event.files?.[0] as File;
    event.files = [];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          const transferRequestsSchema = z.array(TransferRequestSchema);
          this.selectedData.set(transferRequestsSchema.parse(data) as TransferRequest[]);
        } catch (e) {
          console.error('Invalid JSON file:', e);
          this.appMessageService.error(
            $localize`:@@migrations.toastTitle:Migration`,
            $localize`:@@migrations.invalidFile:Invalid JSON file.`,
          );
        }
      };

      reader.readAsText(file);
    }
  }

  clearSelectedFile() {
    this.selectedData.set(undefined);
  }

  uploadFile() {
    const data = this.selectedData();

    if (data) {
      this.uploading.set(true);
      this.appMessageService.info(
        $localize`:@@migrations.toastTitle:Migration`,
        $localize`:@@migrations.uploadStart:Migration started`,
      );
      this.migrationService
        .uploadMigrationFile(data)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.uploading.set(false)),
        )
        .subscribe(() => {
          this.clearSelectedFile();
          this.appMessageService.success(
            $localize`:@@migrations.toastTitle:Migration`,
            $localize`:@@migrations.uploadSuccess:Migration successful.`,
          );
        });
    }
  }

  downloadDatabase() {
    this.appMessageService.info(
      $localize`:@@migrations.toastTitle:Migration`,
      $localize`:@@migrations.downloadStart:Database download started.`,
    );
    this.migrationService.downloadDatabase().subscribe((data) => {
      downloadJson(data, 'database-migration.json');
      this.appMessageService.success(
        $localize`:@@migrations.toastTitle:Migration`,
        $localize`:@@migrations.downloadSuccess:Database downloaded.`,
      );
    });
  }
}
