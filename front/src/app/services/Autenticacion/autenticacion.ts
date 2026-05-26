import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class autenticacion {
  private API_URL = 'http://localhost:8080/api/auth';
  private CLIENTE_API_URL = 'http://localhost:8080/api/cliente';
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

  // ---------- Perfil ----------

  // Obtiene los datos completos del perfil del cliente autenticado
  obtenerPerfil() {
    return this.http.get(`${this.CLIENTE_API_URL}/perfil`, this.httpOptions);
  }

  // Actualiza los datos editables del perfil
  actualizarPerfil(datos: any) {
    return this.http.put(`${this.CLIENTE_API_URL}/perfil`, datos, this.httpOptions);
  }

  // Cambia la contrasena verificando la contrasena actual
  cambiarContrasena(datos: any) {
    return this.http.put(`${this.CLIENTE_API_URL}/perfil/cambiar-contrasena`, datos, this.httpOptions);
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