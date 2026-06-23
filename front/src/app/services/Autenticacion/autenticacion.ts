import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class autenticacion {
  private API_URL = 'http://localhost:8080/api/auth';
  private CLIENTE_API_URL = 'http://localhost:8080/api/cliente';
  private httpOptions = { withCredentials: true };

  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any) {
    return this.http.post(`${this.API_URL}/login`, credentials, this.httpOptions);
  }

  registrar(userData: any) {
    return this.http.post(`${this.API_URL}/registro`, userData, this.httpOptions);
  }

  verificarToken(data: any) {
    return this.http.post(`${this.API_URL}/verificar-token`, data, this.httpOptions);
  }

  obtenerPerfil() {
    return this.http.get(`${this.CLIENTE_API_URL}/perfil`, this.httpOptions);
  }

  actualizarPerfil(datos: any) {
    return this.http.put(`${this.CLIENTE_API_URL}/perfil`, datos, this.httpOptions);
  }

  cambiarContrasena(datos: any) {
    return this.http.put(`${this.CLIENTE_API_URL}/perfil/cambiar-contrasena`, datos, this.httpOptions);
  }

  setCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  logoutFront() {
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Estás seguro de cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'rgb(39, 204, 75)',
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}