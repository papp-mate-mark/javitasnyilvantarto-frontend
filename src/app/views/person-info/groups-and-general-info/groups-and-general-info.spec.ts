import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupsAndGeneralInfo } from './groups-and-general-info';
import { testHttpClientProviders } from '../../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('GroupsAndGeneralInfo', () => {
  let component: GroupsAndGeneralInfo;
  let fixture: ComponentFixture<GroupsAndGeneralInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsAndGeneralInfo],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter([]),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupsAndGeneralInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
