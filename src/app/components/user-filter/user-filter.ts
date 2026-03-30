import { Component, output, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TextInput } from '../text-input/text-input';
import { FormControl, FormGroup } from '@angular/forms';
import UserFilterParams from '../../model/user-filter-params';
import { createChangeHandler } from '../../helper/changeHandler';
import { ButtonModule } from 'primeng/button';
import { HasAuthorityDirective } from '../../directive/has-authority.directive';
import { UserAuthorites } from '../../model/user-autorities';

@Component({
  selector: 'app-user-filter',
  imports: [CardModule, TextInput, ButtonModule, HasAuthorityDirective],
  templateUrl: './user-filter.html',
  styleUrl: './user-filter.scss',
})
export class UserFilter {
  /**
   * Emitted when the filter parameters change.
   */
  readonly filterChanged = output<UserFilterParams>();
  /**
   * Emitted when the create user action is requested.
   */
  readonly newUserCreatePressed = output<void>();
  private readonly filterValue = signal<UserFilterParams>({} as UserFilterParams);

  protected readonly parentGroup = new FormGroup({
    searchUserNameControl: new FormControl<string | undefined>(undefined),
    searchNameControl: new FormControl<string | undefined>(undefined),
  });

  handleChange = createChangeHandler<UserFilterParams>(this.filterValue, () => {
    this.filterChanged.emit(this.filterValue());
  });

  createUserAuthority = UserAuthorites.MODIFY_USERS;
}
