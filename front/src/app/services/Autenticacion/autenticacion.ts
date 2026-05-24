import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class autenticacion {
  private API_URL = 'http://localhost:8080/api/auth';
  private httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) { }

  login(credentials: any) {
    return this.http.post(`${this.API_URL}/login`, credentials, this.httpOptions);
  }

  registrar(userData: any) {
    return this.http.post(`${this.API_URL}/registro`, userData, this.httpOptions);
  }

  verificarToken(data: any) {
    return this.http.post(`${this.API_URL}/verificar-token`, data, this.httpOptions);
  }

  setCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}