import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDialog } from './settings-dialog';
import { testHttpClientProviders } from '../../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Settings } from '../../../views/settings/settings';

describe('SettingsDialog', () => {
  let component: SettingsDialog;
  let fixture: ComponentFixture<SettingsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsDialog],
      providers: [...testHttpClientProviders, provideStore(), MessageService, ConfirmationService],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('settingToEdit', {} as Settings);
    fixture.componentRef.setInput('dialogVisible', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
