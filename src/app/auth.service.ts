import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../environments/environment';

interface LoginResponse { token: string; email: string; role: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => localStorage.setItem('ub_admin_token', response.token))
    );
  }
  logout(): void { localStorage.removeItem('ub_admin_token'); }
  isAuthenticated(): boolean { return !!localStorage.getItem('ub_admin_token'); }
  token(): string | null { return localStorage.getItem('ub_admin_token'); }
}
