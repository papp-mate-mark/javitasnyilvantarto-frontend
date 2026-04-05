import { Routes } from '@angular/router';
import { PageTitle } from './model/enums/PageTitle';
import { Login } from './components/login/login';
import { loginGuard } from './guard/login.guard';
import { loggedOutGuard } from './guard/logged-out.guard';
import { UserAuthorites } from './model/user-autorities';
import { authorityGuard } from './guard/authority.guard';

export const routes: Routes = [
  {
    path: PageTitle.LOGIN,
    component: Login,
    canActivate: [loggedOutGuard],
  },
  {
    path: '',
    canActivate: [loginGuard, authorityGuard],
    loadComponent: () => import('./components/menubar/menubar').then((m) => m.Menubar),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PageTitle.ACTIVE_JOBS,
      },
      {
        path: PageTitle.ACTIVE_JOBS,
        loadComponent: () =>
          import('./components/active-jobs/active-jobs').then((m) => m.ActiveJobs),
        data: {
          label: $localize`:@@menu.activeJobs:Active Jobs`,
        },
      },
      {
        path: PageTitle.PERSON_INFO + '/:personId',
        loadComponent: () => import('./views/person-info/person-info').then((m) => m.PersonInfo),
        data: {
          label: $localize`:@@menu.person:Person Info`,
          excludeFromMenu: true,
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./views/person-info/groups-and-general-info/groups-and-general-info').then(
                (m) => m.GroupsAndGeneralInfo,
              ),
            data: { excludeFromMenu: true },
          },
          {
            path: PageTitle.JOB_INFO + '/:jobId',
            loadComponent: () => import('./views/person-info/job/job').then((m) => m.Job),
            data: { excludeFromMenu: true },
          },
        ],
      },
      {
        path: PageTitle.NEW_JOB,
        loadComponent: () => import('./views/new-job/new-job').then((m) => m.NewJob),
        data: {
          label: $localize`:@@menu.newJob:New Job`,
          requiredAuthority: UserAuthorites.CREATE_JOBS,
        },
      },
      {
        path: PageTitle.PERSON_SEARCH,
        loadComponent: () =>
          import('./views/person-search/person-search').then((m) => m.PersonSearchComponent),
        data: {
          label: $localize`:@@menu.personSearch:Person Search`,
        },
      },
      {
        path: PageTitle.JOB_SEARCH,
        loadComponent: () => import('./views/job-search/job-search').then((m) => m.JobSearch),
        data: {
          label: $localize`:@@menu.jobSearch:Job Search`,
        },
      },
      {
        path: PageTitle.USERS,
        loadComponent: () => import('./views/users/users').then((m) => m.Users),
        data: {
          label: $localize`:@@menu.users:Users`,
          requiredAuthority: UserAuthorites.LIST_USERS,
        },
      },
      {
        path: PageTitle.SYSTEM_SETTINGS,
        loadComponent: () => import('./views/settings/settings').then((m) => m.Settings),
        data: {
          label: $localize`:@@menu.systemSettings:System Settings`,
          requiredAuthority: UserAuthorites.MODIFY_SYSTEM_SETTINGS,
        },
      },
      {
        path: PageTitle.MIGRATION,
        loadComponent: () => import('./views/migration/migration').then((m) => m.Migration),
        data: {
          label: $localize`:@@menu.migration:Migration`,
          requiredAuthority: UserAuthorites.MANAGE_MIGRATIONS,
        },
      },
      {
        path: PageTitle.USER_PAGE,
        loadComponent: () => import('./views/user-page/user-page').then((m) => m.UserPage),
        data: {
          excludeFromMenu: true,          
        },
      },
    ],
  },
];
