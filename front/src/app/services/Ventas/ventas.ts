import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Venta {
  total: number;
  metodoPago: string;
  clienteId: number | null;
  citaId: number | null;
  tarjeta?: { numeroTarjeta: string; expiracion: string };
  voucher?: { imagenBase64: string };
}

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private apiUrl = 'http://localhost:8080/api/ventas';
  private httpOptions = { withCredentials: true };

  constructor(private http: HttpClient) {}

  procesarPago(venta: Venta): Observable<any> {
    return this.http.post(`${this.apiUrl}/procesar`, venta, this.httpOptions);
  }

  cobrarEnLocal(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cobrar/${id}`, {}, this.httpOptions);
  }
}
