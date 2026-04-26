import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { autenticacion } from '../../services/autenticacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  nuevoUsuario = {
    nombre: '',
    email: '',
    password: '',
    rol: 'CLIENTE'
  };
  
  constructor(private autenticacion: autenticacion, private router: Router) {}

  onRegistro() {
  this.autenticacion.registrar(this.nuevoUsuario).subscribe({
    next: (res) => {
      alert("¡Cuenta creada! Ahora puedes iniciar sesión.");
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error("Detalle del error:", err);
      alert("Error en el servidor. Revisa la consola de Java.");
    }
  });
}
}
