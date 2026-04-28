import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Mascota {
  private apiUrl = 'http://localhost:8080/api/mascotas';

  constructor(private http: HttpClient) {}

  listarPorCliente(clienteId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  registrar(mascota: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, mascota);
  }
}
