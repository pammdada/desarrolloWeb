import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class autenticacion {
  private API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(credentials: any) {
    return this.http.post(`${this.API_URL}/login`, credentials);
  }

  registrar(userData: any) {
    return this.http.post('http://localhost:8080/api/auth/registrar', userData);
  }
}