import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { IndexComponent } from './pages/index/index.component';
import { signInGuard } from './guards/sign-in.guard';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';

export const routes: Routes = [
  {
    path: 'welcome',
    component: IndexComponent,
    canActivate: [signInGuard]
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
        path: 'main',
        loadChildren: () =>
          import('./pages/main/routes').then((m) => m.MAIN_ROUTES),
      },
      {
        path: 'profile',
        loadChildren: () => import('./pages/profile/routes').then(m => m.PROFILE_ROUTES),
      },
      {
        path: 'companies',
        loadChildren: () => import('./pages/companies/routes').then(m => m.COMPANIES_ROUTES),
      },
      {
        path: 'countries',
        loadChildren: () => import('./pages/countries/routes').then(m => m.HOLIDAYS_ROUTES),
      },
      // {
      //   path: '',
      //   redirectTo: 'main',
      //   pathMatch: 'full',
      // },
    ],
  },
  // 잘못된 URL을 사용했을때 메인으로 보냄
  {
    path: '**',
    // redirectTo: 'welcome',
    redirectTo: 'main',
    pathMatch: 'full',
  },
];

