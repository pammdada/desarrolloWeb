import { Injectable } from '@angular/core';

export interface Servicio {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = 'http://localhost:8080/api/servicios';

  constructor(private http: HttpClient) { }
  
  listarServicios(): Observable<any> {
    return this.http.get(this.apiUrl, { withCredentials: true });
  }

  crearServicio(servicio: Servicio): Observable<any> {
    return this.http.post(this.apiUrl, servicio, { withCredentials: true });
  }
}