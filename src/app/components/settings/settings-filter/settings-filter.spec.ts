import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsFilter } from './settings-filter';

describe('SettingsFilter', () => {
  let component: SettingsFilter;
  let fixture: ComponentFixture<SettingsFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
