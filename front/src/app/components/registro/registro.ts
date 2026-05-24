import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { autenticacion } from '../../services/Autenticacion/autenticacion';
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
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    telefono: '',
    dni: '',
    rol: 'CLIENTE'
  };
  
  constructor(private autenticacion: autenticacion, private router: Router) {}

  onRegistro() {
    this.autenticacion.registrar(this.nuevoUsuario).subscribe({
      next: (res: any) => {
        if (res?.exito === false) {
          alert('Error de registro: ' + (res.mensaje || res.message || 'No se pudo registrar'));
          return;
        }

        let mensaje = res.mensaje || res.message || "¡Cuenta creada! Revisa tu correo y verifica el código enviado.";
        const token = res.datos?.token || res.data?.token;
        if (token) {
          mensaje += "\nCódigo de verificación: " + token;
        }
        alert(mensaje);
        this.router.navigate(['/verificar-token'], {
          queryParams: { correo: this.nuevoUsuario.correo }
        });
      },
      error: (err: any) => {
        console.error("Detalle del error:", err);
        const mensaje = err.error?.mensaje || err.error?.message || 'Error en el servidor';
        alert('Error de registro: ' + mensaje);
      }
    });
  }
}
