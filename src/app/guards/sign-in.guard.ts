import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { tokenGetter } from '../app.config';

export const signInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const routePath = state.url; // state.url을 사용하여 현재 경로를 가져옵니다.

  // 사용자 인증 여부를 확인합니다.
  const isAuthenticated = authService.getTokenInfo();
  console.log('isAuth :', isAuthenticated)
  // 인증되지 않은 사용자 처리 로직
  if (!isAuthenticated) {
    // 'sign-in' 또는 빈 경로 접근 허용
    if (routePath === '/sign-in' || routePath === '/') {
      return true;
    }
    // 그 외 경로는 홈으로 리디렉션
    router.navigate(['/']);
    return false;
  }

  // 인증된 사용자 처리 로직
  if (routePath === '/sign-in' || routePath === '/') {
    router.navigate(['/main']); // 'sign-in' 또는 빈 경로 접근 시 메인 페이지로 리디렉션
    return false;
  }
  return true;
};
