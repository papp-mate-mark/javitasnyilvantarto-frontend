import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserModificationDialog } from './user-modification-dialog';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { MessageService } from 'primeng/api';
import { testHttpClientProviders } from '../../provider/test-providers';

describe('UserModificationDialog', () => {
  let component: UserModificationDialog;
  let fixture: ComponentFixture<UserModificationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserModificationDialog],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter(routes),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserModificationDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dialogVisible', false);
    fixture.componentRef.setInput('userToModify', undefined);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
