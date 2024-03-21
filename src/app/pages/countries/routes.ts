import { CompaniesListComponent } from '../companies/companies-list/companies-list.component';
import { Route } from '@angular/router';


export const HOLIDAYS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./countries-list/countries-list.component').then((m) => m.CountriesListComponent)
  },
];
