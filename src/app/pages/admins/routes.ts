import { Route } from '@angular/router';

export const ADMINS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./admins-list/admins-list.component').then(
        (m) => m.AdminsListComponent
      ),
  },
];
