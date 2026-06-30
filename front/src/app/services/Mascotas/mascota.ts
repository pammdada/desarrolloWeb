import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MascotaResponse {
  id: number;
  nombre: string;
  tipo: string;
  raza: string;
  edad: number;
  fotoUrl: string | null;
  cliente?: { id: number; nombre: string };
  veterinario?: { id: number; nombre: string; apellidos: string; especialidad: string } | null;
}

@Injectable({
  providedIn: 'root',
})
export class MascotaService {
  private apiUrl = 'http://localhost:8080/api/cliente/mascotas';
  private apiClienteUrl = 'http://localhost:8080/api/cliente';

  constructor(private http: HttpClient) {}

  listarPorCliente(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true });
  }

  registrar(mascota: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, mascota, { withCredentials: true });
  }

  listarVeterinarios(): Observable<any> {
    return this.http.get<any>(`${this.apiClienteUrl}/veterinarios-disponibles`, { withCredentials: true });
  }
}
