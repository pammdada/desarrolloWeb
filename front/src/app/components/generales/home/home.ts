import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  veterinarios = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/publico/veterinarios', { withCredentials: true })
      .subscribe((res: any) => {
        if (res?.exito && res?.datos) {
          this.veterinarios.set(res.datos);
        }
      });
  }
}
