import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { IndexComponent } from './pages/index/index.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { isLoggedInGuard } from './guards/is-logged-in.guard';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./pages/auth/sign-up/sign-up.component').then(
        (m) => m.SignUpComponent
      ),
  },
  {
    path: 'find-pw',
    loadComponent: () =>
      import(`./pages/auth/find-pw/find-pw.component`).then(
        (m) => m.FindPwComponent
      ),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [],
    children: [
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/profile/routes').then((m) => m.PROFILE_ROUTES),
      },
      {
        path: 'companies',
        loadChildren: () =>
          import('./pages/companies/routes').then((m) => m.COMPANIES_ROUTES),
      },
      {
        path: 'countries',
        loadChildren: () =>
          import('./pages/countries/routes').then((m) => m.HOLIDAYS_ROUTES),
      },
      {
        path: 'admins',
        loadComponent: () =>
          import('./pages/admins/admins-list.component').then(
            (m) => m.AdminsListComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'countries',
    pathMatch: 'full',
  },
];
