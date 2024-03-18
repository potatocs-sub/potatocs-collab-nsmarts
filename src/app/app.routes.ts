import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  // {
  //   path: 'sign-in',
  //   loadComponent: () =>
  //     import('./pages/auth/sign-in/sign-in.component').then(
  //       (m) => m.SignInComponent
  //     ),
  // },
  // {
  //   path: 'sign-up',
  //   loadComponent: () =>
  //     import('./pages/auth/sign-up/sign-up.component').then(
  //       (m) => m.SignUpComponent
  //     ),
  // },
  //   {
  //     path: 'find-pw',
  //     loadComponent: () =>
  //       import(`./pages/auth/find-pw/find-pw.component`).then(
  //         (m) => m.FindPwComponent
  //       ),
  //   },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [],
    children: [
      // {
      //   path: 'main',
      //   loadChildren: () =>
      //     import('./pages/main/routes').then((m) => m.MAIN_ROUTES),
      // },

      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
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

