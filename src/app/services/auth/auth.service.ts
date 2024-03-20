import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { shareReplay, tap } from 'rxjs';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient)
  private jwtHelper = inject(JwtHelperService);

  constructor() { }

  signUp(userData: any) {
    return this.http.post('/api/v1/nsAuth/signUp', userData);
  }

  signIn(userData: any) {
    return this.http.post<Token>('/api/v1/nsAuth/signIn', userData).pipe(
      tap((res: any) => this.setToken(res.token))
    );
  }

  // get verification code + email
  getEcode(emailData: any) {
    return this.http.post('/api/v1/auth/getEcode', emailData)
  }

  // set temp password + email
  getTempPw(emailData: any) {
    return this.http.put('/api/v1/auth/getTempPw', emailData)
  }

  logOut(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getToken(): string | null {
    return localStorage.getItem(environment.tokenName);
  }

  setToken(token: string): void {
    localStorage.setItem(environment.tokenName, token);
  }

  removeToken(): void {
    localStorage.removeItem(environment.tokenName);
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  getTokenInfo() {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }
}
