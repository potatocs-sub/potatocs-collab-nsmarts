import { Route } from '@angular/router';

export const COMPANIES_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./companies-list/companies-list.component').then(
        (m) => m.CompaniesListComponent
      ),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./companies-add/companies-add.component').then(
        (m) => m.CompaniesAddComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./companies-edit/companies-edit.component').then(
        (m) => m.CompaniesEditComponent
      ),
  },
];
