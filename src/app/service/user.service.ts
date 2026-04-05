import { inject, Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { toHttpParams } from '../helper/to-http-params';
import ErrorMessage from '../model/error-message';
import PageResponse from '../model/page-response';
import Pageable, { toPageableParams } from '../model/pageable';
import PasswordResponse from '../model/password-response';
import ResetOwnPasswordRequest from '../model/reset-own-password-request';
import User from '../model/user';
import UserFilterParams from '../model/user-filter-params';
import UserRegisterRequest from '../model/user-register-request';
import { ApiService } from './api.service';
import { validateOnServerError } from './form-validation';
import { UserStore } from '../store/user.store';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService = inject(ApiService);
  private readonly userStore = inject(UserStore);

  listUsers(filterParams: UserFilterParams, pageable: Pageable) {
    this.userStore.setUsersLoading(true);

    return this.apiService
      .getReq<PageResponse<User>>(
        `/users/search`,
        new ErrorMessage(
          $localize`:@@userService.listUsersTitle:List Users`,
          $localize`:@@userService.listUsersFailed:Listing users failed`
        ),
        toHttpParams({ ...filterParams, ...toPageableParams(pageable) })
      )
      .pipe(finalize(() => this.userStore.setUsersLoading(false)));
  }

  deleteUser(userId: number) {
    return this.apiService.deleteReq<void>(
      `/users/${userId}`,
      new ErrorMessage(
        $localize`:@@userService.deleteUserTitle:Delete User`,
        $localize`:@@userService.deleteUserFailed:Deleting user failed`
      )
    );
  }

  registerUser(data: UserRegisterRequest) {
    return this.apiService
      .postReq<PasswordResponse>(
        `/users`,
        new ErrorMessage(
          $localize`:@@userService.registerUserTitle:Register User`,
          $localize`:@@userService.registerUserFailed:Registering user failed`
        ),
        data
      )
      .pipe(validateOnServerError(this.userStore));
  }

  updateUser(id: number, data: UserRegisterRequest) {
    return this.apiService
      .putReq<void>(
        `/users/${id}`,
        new ErrorMessage(
          $localize`:@@userService.updateUserTitle:Updating User`,
          $localize`:@@userService.updateUserFailed:Updating user failed`
        ),
        data
      )
      .pipe(validateOnServerError(this.userStore));
  }

  resetPassword(userId: number) {
    return this.apiService.postReq<PasswordResponse>(
      `/users/${userId}/reset-password`,
      new ErrorMessage(
        $localize`:@@userService.resetPasswordTitle:Reset Password`,
        $localize`:@@userService.resetPasswordFailed:Resetting password failed`
      ),
      {}
    );
  }

  resetOwnPassword(newPassword: string) {
    return this.apiService
      .putReq<void>(
        `/users/me/password`,
        new ErrorMessage(
          $localize`:@@userService.resetOwnPasswordTitle:Change Password`,
          $localize`:@@userService.resetOwnPasswordFailed:Changing password failed`
        ),
        new ResetOwnPasswordRequest(newPassword)
      )
      .pipe(validateOnServerError(this.userStore));
  }
}
