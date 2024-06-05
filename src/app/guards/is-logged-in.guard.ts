import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const routePath = state.url; // state.url을 사용하여 현재 경로를 가져옵니다.

  if (!authService.isAuthenticated()) {
    if (
      routePath === '/sign-in' ||
      routePath === '/sign-up' ||
      routePath === '/find-pw'
    ) {
      return true; // 인증되지 않은 사용자가 해당 경로에 접근하는 것은 허용
    }
    router.navigate(['/sign-in']); // 인증되지 않은 사용자가 다른 경로에 접근하는 경우 로그인 페이지로 리디렉션
    return false;
  } else {
    if (
      routePath === '/sign-in' ||
      routePath === '/sign-up' ||
      routePath === '/find-pw' ||
      routePath === '/'
    ) {
      router.navigate(['/companies']); // 이미 인증된 사용자가 해당 경로에 접근하려고 할 때 홈 페이지로 리디렉션
      return false;
    }
    return true; // 인증된 사용자는 모든 경로에 접근 가능
  }
};
