import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { autenticacion } from '../../services/Autenticacion/autenticacion';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  //  Navega directamente al formulario de registro sin pasar por home
  irARegistro() {
    this.router.navigate(['/registro']);
  }

  onLogin() {
    const credentials = {
      correo: this.credentials.correo.trim().toLowerCase(),
      contrasena: this.credentials.contrasena
    };

    this.autenticacion.login(credentials).subscribe({
      next: (res: any) => {
        if (res?.exito === false) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: ("Credenciales incorrectas, intente de nuevo."),
          });
          return;
        }

        const user = res.datos ?? res.data;
        if (!user) {
          Swal.fire({
            icon: "error",
            text: "Error de autenticación: respuesta inválida del servidor",
          });
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
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Credenciales incorrectas, intente de nuevo.",
        });
      },
    });
  }
}
