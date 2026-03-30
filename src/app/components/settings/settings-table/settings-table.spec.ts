import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTable } from './settings-table';

describe('SettingsTable', () => {
  let component: SettingsTable;
  let fixture: ComponentFixture<SettingsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
