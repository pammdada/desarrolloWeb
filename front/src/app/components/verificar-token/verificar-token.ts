import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { autenticacion } from '../../services/Autenticacion/autenticacion';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verificar-token',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './verificar-token.html',
  styleUrl: './verificar-token.css',
})
export class VerificarToken {
  data = {
    correo: '',
    token: ''
  };

  constructor(
    private autenticacion: autenticacion,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['correo']) {
        this.data.correo = params['correo'];
      }
    });
  }

  //  Navega directamente al login sin pasar por home
  irALogin() {
    this.router.navigate(['/login']);
  }

  verificarToken() {
    const requestData = {
      correo: this.data.correo.trim().toLowerCase(),
      token: this.data.token.trim()
    };

    // Log para depurar qué datos se están enviando al backend
    console.log('Enviando verificación:', requestData);

    this.autenticacion.verificarToken(requestData).subscribe({
      next: (res: any) => {
        // Log para ver la respuesta completa del backend
        console.log('Respuesta verificación:', res);

        if (res?.exito === false) {
          alert('Error al verificar el código: ' + (res.mensaje || res.message || 'Código incorrecto'));
          return;
        }
        alert('Código verificado correctamente. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        // Log detallado del error HTTP para facilitar depuración
        console.error('Error HTTP al verificar token:', err);
        console.error('Status:', err.status);
        console.error('Cuerpo del error:', err.error);

        const mensaje = err.error?.mensaje || err.error?.message || 'Error al verificar el código';
        alert('Error al verificar el código: ' + mensaje);
      }
    });
  }
}
