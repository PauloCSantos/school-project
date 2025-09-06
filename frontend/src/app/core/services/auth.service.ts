import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = localStorage;

  setToken(token: string) {
    if (token) this.storage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this.storage.getItem(TOKEN_KEY);
  }

  clearToken() {
    this.storage.removeItem(TOKEN_KEY);
  }

  logout() {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
