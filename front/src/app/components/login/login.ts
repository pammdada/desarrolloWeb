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
  credentials = { email: '', password: '' };

  constructor(private autenticacion: autenticacion, private router: Router) {}

  onLogin() {
    this.autenticacion.login(this.credentials).subscribe({
      next: (user: any) => {
        this.autenticacion.setCurrentUser(user);
        const rolRecibido = user.rol.toUpperCase();
        if (rolRecibido == 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (rolRecibido == 'VETERINARIO') {
          this.router.navigate(['/veterinario']);
        } else if (rolRecibido == 'CLIENTE') {
          this.router.navigate(['/cliente']);
        }
      },
      error: (err) => alert ('Error de autenticación: ' + err.error.message),
    });
  }
}