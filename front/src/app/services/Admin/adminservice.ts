import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private apiUrl = 'http://localhost:8080/api/admin';
  
  constructor(private http: HttpClient) {}
  
  getVeterinarios(status?: string): Observable<any> {
    let params = new HttpParams();
    if (status) params = params.set('estado', status);
    return this.http.get(`${this.apiUrl}/veterinarios`, { params, withCredentials: true });
  }
  
  createVeterinario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/veterinarios`, data, { withCredentials: true });
  }
  
  fireVeterinario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/veterinarios/${id}`, { withCredentials: true });
  }

  getVeterinarioById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/veterinarios/${id}`, { withCredentials: true });
  }

  updateVeterinario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/veterinarios/${id}`, data, { withCredentials: true });
  }
}