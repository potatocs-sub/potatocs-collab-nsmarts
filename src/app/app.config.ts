import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment.development';
import { MaterialsModule } from './materials/materials.module';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export function tokenGetter() {
  return localStorage.getItem(environment.tokenName);
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: [
            environment.apiUrl,
            environment.localhostUrl,
            environment.domainUrl,
          ],
          disallowedRoutes: ['/api/v1/nsAuth/signIn', '/api/v1/nsAuth/signUp'],
        },
      }),
      MaterialsModule,
      BrowserAnimationsModule
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideAnimations(),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
  ],
};
