import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Login } from '@app/models/Login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private userRole: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
    this.userRole = localStorage.getItem('userRole');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  login(credentials: Login) {

  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    this.token = null;
    this.userRole = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }
}
