import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { autenticacion } from '../../services/Autenticacion/autenticacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = { correo: '', contrasena: '' };

  constructor(private autenticacion: autenticacion, private router: Router) {}

  onLogin() {
    const credentials = {
      correo: this.credentials.correo.trim().toLowerCase(),
      contrasena: this.credentials.contrasena
    };

    this.autenticacion.login(credentials).subscribe({
      next: (res: any) => {
        if (res?.exito === false) {
          alert('Error de autenticación: ' + (res.mensaje || res.message || 'Credenciales incorrectas'));
          return;
        }

        const user = res.datos ?? res.data;
        if (!user) {
          alert('Error de autenticación: respuesta inválida del servidor');
          return;
        }

        this.autenticacion.setCurrentUser(user);
        const rolRecibido = user?.rol?.toUpperCase();
        if (rolRecibido == 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (rolRecibido == 'VETERINARIO') {
          this.router.navigate(['/veterinario']);
        } else if (rolRecibido == 'CLIENTE') {
          this.router.navigate(['/cliente']);
        }
      },
      error: (err: any) => {
        const mensaje = err.error?.mensaje || err.error?.message || 'Credenciales incorrectas';
        alert('Error de autenticación: ' + mensaje);
      },
    });
  }
}