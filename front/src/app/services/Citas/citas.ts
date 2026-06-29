import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Citas {
  private apiClienteUrl = 'http://localhost:8080/api/cliente';
  private apiVeterinarioUrl = 'http://localhost:8080/api/veterinario';
  private httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) { }

  // Métodos para clientes
  agendarCita(cita: any): Observable<any> {
    return this.http.post(`${this.apiClienteUrl}/citas`, cita, this.httpOptions);
  }

  misCitas(): Observable<any> {
    return this.http.get<any>(`${this.apiClienteUrl}/citas`, this.httpOptions);
  }

  aceptarReagendacion(citaId: number): Observable<any> {
    return this.http.patch(`${this.apiClienteUrl}/citas/${citaId}/aceptar-reagendacion`, {}, this.httpOptions);
  }

  rechazarReagendacion(citaId: number): Observable<any> {
    return this.http.patch(`${this.apiClienteUrl}/citas/${citaId}/rechazar-reagendacion`, {}, this.httpOptions);
  }

  // Métodos para veterinarios
  listarPendientes(): Observable<any> {
    return this.http.get<any>(`${this.apiVeterinarioUrl}/citas/pendientes`, this.httpOptions);
  }

  aceptarCita(citaId: number): Observable<any> {
    return this.http.patch(`${this.apiVeterinarioUrl}/citas/${citaId}/aceptar`, {}, this.httpOptions);
  }

  rechazarCita(citaId: number): Observable<any> {
    return this.http.patch(`${this.apiVeterinarioUrl}/citas/${citaId}/rechazar`, {}, this.httpOptions);
  }

  actualizarEstado(citaId: number, nuevoEstado: string): Observable<any> {
    if (nuevoEstado === 'ACEPTADA') {
      return this.aceptarCita(citaId);
    } else if (nuevoEstado === 'RECHAZADA') {
      return this.rechazarCita(citaId);
    }
    return this.http.patch(`${this.apiVeterinarioUrl}/citas/${citaId}/${nuevoEstado.toLowerCase()}`, {}, this.httpOptions);
  }

  getMyAppointments(estado: string): Observable<any> {
    const params = new HttpParams().set('estado', estado);
    return this.http.get(`${this.apiVeterinarioUrl}/citas/aceptadas`, { params, ...this.httpOptions });
  }
  rescheduleAppointment(id: number, datos: { nuevaFecha: string, nuevaHora: string }): Observable<any> {
    return this.http.patch(`${this.apiVeterinarioUrl}/citas/${id}/reagendar`, datos, this.httpOptions);
  }

  addReport(id: number, reporte: string): Observable<any> {
    return this.http.patch(`${this.apiVeterinarioUrl}/citas/${id}/reporte`, { reporte }, this.httpOptions);
  }

  markAsAttended(id: number): Observable<any> {
    return this.http.patch(`${this.apiVeterinarioUrl}/citas/${id}/atender`, {}, this.httpOptions);
  }

  finalizarAtencion(id: number, datos: { reporte: string, problema: string }): Observable<any> {
    return this.http.put(`http://localhost:8080/api/citas/atender/${id}`, datos, this.httpOptions);
  }
}
