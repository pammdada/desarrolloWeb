import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Citas {
  private apiUrl = 'http://localhost:8080/api/citas';

  constructor(private http: HttpClient) {}

  agendarCita(cita: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, cita);
  }

  listarPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pendientes`);
  }
  
  actualizarEstado(citaId: number, nuevoEstado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${citaId}/estado`, { estado: nuevoEstado });
  }

}
