import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { SettingsFilter } from '../../components/settings/settings-filter/settings-filter';
import { SettingsTable } from '../../components/settings/settings-table/settings-table';
import { SettingsDialog } from '../../components/settings/settings-dialog/settings-dialog';
import SystemSettings from '../../model/system-settings';
import Pageable from '../../model/pageable';
import { SettingsStore } from '../../store/settings.store';
import { SettingsService } from '../../service/settings.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import SystemSettingsFilterParams from '../../model/system-settings-filter-params';

@Component({
  selector: 'app-settings',
  imports: [SettingsFilter, SettingsTable, SettingsDialog],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  private readonly settingsStore = inject(SettingsStore);
  private readonly settingsService = inject(SettingsService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly settingsToEdit = signal<SystemSettings | undefined>(undefined);
  protected readonly dialogVisible = signal<boolean>(false);
  private readonly pageOptions = signal<Pageable>(new Pageable());
  private readonly searchTerm = signal<SystemSettingsFilterParams>(
    {} as SystemSettingsFilterParams,
  );

  editPressed(setting: SystemSettings) {
    this.settingsToEdit.set(setting);
    this.dialogVisible.set(true);
  }

  pageOptionsChanged(pageable: Pageable) {
    this.pageOptions.set(pageable);
    this.fetch();
  }

  searchChanged(search: SystemSettingsFilterParams) {
    this.searchTerm.set(search);
    this.fetch();
  }

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.settingsService
      .searchSettings(this.searchTerm(), this.pageOptions())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.settingsStore.setSettings(response);
      });
  }
}
