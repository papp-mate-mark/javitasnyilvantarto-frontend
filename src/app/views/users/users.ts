import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UserTable } from '../../components/user-table/user-table';
import { UserFilter } from '../../components/user-filter/user-filter';
import UserFilterParams from '../../model/user-filter-params';
import User from '../../model/user';
import Pageable from '../../model/pageable';
import { UserService } from '../../service/user.service';
import { UserStore } from '../../store/user.store';
import PageResponse from '../../model/page-response';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserModificationDialog } from '../../components/user-modification-dialog/user-modification-dialog';
import { NewPasswordDialog } from '../../components/new-password-dialog/new-password-dialog';
import { AppConfirmationService } from '../../service/confirmation.service';
import PasswordResponse from '../../model/password-response';

@Component({
  selector: 'app-users',
  imports: [UserTable, UserFilter, UserModificationDialog, NewPasswordDialog],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  private readonly filterParams = signal<UserFilterParams>(new UserFilterParams());
  private readonly pageable = signal<Pageable>(new Pageable());
  private readonly userStore = inject(UserStore);
  private readonly userService = inject(UserService);
  private readonly destroRef = inject(DestroyRef);

  protected readonly dialogVisible = signal(false);
  protected readonly passwordDialogVisible = signal(false);
  protected readonly generatedPass = signal<string>('');
  protected readonly userToModify = signal<User | undefined>(undefined);
  private readonly confirmationService = inject(AppConfirmationService);
  ngOnInit(): void {
    this.fetchUsers();
  }

  changePageOptions(pageOptions: Pageable) {
    this.pageable.set(pageOptions);
    this.fetchUsers();
  }

  deleteUser(user: User) {
    this.confirmationService.proceed(
      () => {
        this.userService
          .deleteUser(user.id)
          .pipe(takeUntilDestroyed(this.destroRef))
          .subscribe(() => {
            this.fetchUsers();
          });
      },
      undefined,
      $localize`:@@users.deleteUserConfirmation:Are you sure you want to delete the user ${user.username}?`,
    );
  }

  editUser(user: User) {
    this.userToModify.set(user);
    this.dialogVisible.set(true);
  }

  resetUserPassword(user: User) {
    this.confirmationService.proceed(
      () => {
        this.userService
          .resetPassword(user.id)
          .pipe(takeUntilDestroyed(this.destroRef))
          .subscribe((password: PasswordResponse) => {
            this.showPassword(password.newPassword);
          });
      },
      undefined,
      $localize`:@@users.resetPasswordConfirmation:Are you sure you want to reset the password for user ${user.username}?`,
    );
  }

  createNewUser() {
    this.userToModify.set(undefined);
    this.dialogVisible.set(true);
  }

  handleFilterChange(event: UserFilterParams) {
    this.filterParams.set(event);
    this.fetchUsers();
  }

  fetchUsers() {
    const filterParams = this.filterParams();
    const pageable = this.pageable();
    this.userService
      .listUsers(filterParams, pageable)
      .pipe(takeUntilDestroyed(this.destroRef))
      .subscribe((users: PageResponse<User>) => {
        this.userStore.setUsers(users);
      });
  }

  showPassword(password: string) {
    this.generatedPass.set(password);
    this.passwordDialogVisible.set(true);
  }
}
