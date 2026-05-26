import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Citas {
  // Cambio: URL corregida a /api/cliente (coincide con ClienteController.java)
  private apiUrl = 'http://localhost:8080/api/cliente';
  // Cambio: agregado withCredentials para enviar la cookie de sesion (JSESSIONID)
  private httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  // Cambio: ruta corregida a /citas (POST en ClienteController)
  agendarCita(cita: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/citas`, cita, this.httpOptions);
  }

  listarPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/citas/pendientes`, this.httpOptions);
  }
  
  actualizarEstado(citaId: number, nuevoEstado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/citas/${citaId}/estado`, { estado: nuevoEstado }, this.httpOptions);
  }

}
