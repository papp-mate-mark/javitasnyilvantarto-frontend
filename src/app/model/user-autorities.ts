export enum UserAuthorites {
  LIST_USERS = 'LIST_USERS',
  MODIFY_USERS = 'MODIFY_USERS',
  CREATE_JOBS = 'CREATE_JOBS',
  MODIFY_JOBS = 'MODIFY_JOBS',
  MODIFY_SYSTEM_SETTINGS = 'MODIFY_SYSTEM_SETTINGS',
  MANAGE_MIGRATIONS = 'MANAGE_MIGRATIONS',
}
export const userAuthorityDropdownValue = (): { label: string; value: UserAuthorites }[] =>
  Object.values(UserAuthorites).map((value) => ({
    label: translateUserAuthority(value),
    value: value,
  }));

export const translateUserAuthority = (authority: UserAuthorites): string => {
  switch (authority) {
    case UserAuthorites.LIST_USERS:
      return $localize`:@@userAuthorities.listUsers:List Users`;
    case UserAuthorites.MODIFY_USERS:
      return $localize`:@@userAuthorities.modifyUsers:Modify Users`;
    case UserAuthorites.CREATE_JOBS:
      return $localize`:@@userAuthorities.createJobs:Create Jobs`;
    case UserAuthorites.MODIFY_JOBS:
      return $localize`:@@userAuthorities.modifyJobs:Modify Jobs`;
    case UserAuthorites.MODIFY_SYSTEM_SETTINGS:
      return $localize`:@@userAuthorities.modifySystemSettings:Modify System Settings`;
    case UserAuthorites.MANAGE_MIGRATIONS:
      return $localize`:@@userAuthorities.manageMigrations:Manage Migrations`;
  }
};
