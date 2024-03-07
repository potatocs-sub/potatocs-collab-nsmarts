import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, } from '@angular/router';
import { tokenGetter } from '../app.config';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService } from '../services/dialog/dialog.service';

export const authGuard: CanActivateFn = (route, state) => {

    const jwtHelper = inject(JwtHelperService);
    const dialogService = inject(DialogService);
    const router = inject(Router);
    const token: any = tokenGetter()
    const userInfo = jwtHelper.decodeToken(token);

    if (userInfo.isManager || userInfo.isSuperManager) {
        return true
    }
    else {
        dialogService.openDialogNegative('권한이 없습니다.')
        router.navigate(['/']);
        return false
    }
};

