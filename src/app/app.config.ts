import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment.development';
import { MaterialsModule } from './materials/materials.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
export function tokenGetter() {
  return localStorage.getItem(environment.tokenName);
}


export const appConfig: ApplicationConfig = {
  providers: [
    // { provide: LOCALE_ID, useValue: 'ko' },
    // APP_INITIALIZER 는 app.compnent가 실행 되기전에 제일 먼저 실행한다. 로그인을 했으면 Access Token 발급
    // {
    //     provide: APP_INITIALIZER,
    //     useFactory: appInitializer,
    //     multi: true,
    //     deps: [AuthService],
    // },

    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: [
            environment.apiUrl,
          ],
          disallowedRoutes: ['/api/v1/auth/signIn', '/api/v1/auth/signUp'],
        },
      }),
      MaterialsModule,
      BrowserAnimationsModule,
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideAnimations(), provideAnimationsAsync(),
  ]
};
