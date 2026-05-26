import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get(`http://localhost:8080/api/veterinario/citas/historial?estado=${estado}`, { withCredentials: true });
  }
  rescheduleAppointment(id: number, datos: { nuevaFecha: string, nuevaHora: string }): Observable<any> {
    return this.http.put(`http://localhost:8080/api/veterinario/citas/${id}/reagendar`, datos, { withCredentials: true });
  }

  addReport(id: number, reporte: string): Observable<any> {
    return this.http.post(`http://localhost:8080/api/veterinario/citas/${id}/reporte`, { reporte }, { withCredentials: true });
  }

  markAsAttended(id: number): Observable<any> {
    return this.http.put(`http://localhost:8080/api/veterinario/citas/${id}/atendida`, {}, { withCredentials: true });
  }

}
